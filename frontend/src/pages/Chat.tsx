import React from "react";
import { useState, useCallback, useEffect, useContext } from 'react';
import {io} from 'socket.io-client';
import axios from "axios";
import { Flex, Box, Heading, Spacer, ListItem} from "@chakra-ui/layout";
import {List, Input, WrapItem, Avatar, Button, Text, Divider, Menu, MenuButton, MenuItem, Center} from "@chakra-ui/react";
import MessageBox from "../components/Message";
import MessageFeed from "../components/MessageFeed";
import { useNavigate } from "react-router-dom";
import { Context } from "../store";
import ScrollableFeed from "react-scrollable-feed";
import Message from "../components/Message";

const Chat: React.FC = () => {

    interface User {
    id: number,
    nickname: string,
    email: string,
    password: string
}

    interface Friend {
        id: number,
        user: User
    }

    interface FriendsResponse {
        id: number,
        friends: Friend[]
    }

    interface Room {
        id: number,
        name: string,
        type: string,
        users: User[]
    }

    const navigate = useNavigate();

    const [testMessages, setTestMessages] = useState<string[]>([]);
    const [hasSent, setHasSent] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [friends, setFriends] = useState<User[]>([]);
    const [connectedToRoom, setConnectedToRoom] = useState<boolean>(false);
    const [room, setRoom] = useState<Room>();
    const [connectedFriend, setConnectedFriend] = useState<string>("");
    const [state, dispatch] = useContext(Context);

    const getFriends = useCallback(async () => {
        const response = await axios.get<FriendsResponse>("http://localhost:3001/friend/me", {headers: {
            Authorization: 'Bearer ' + state.auth.token
        }});
        const users = response.data.friends.map((friend) => friend.user);
        console.log(users);
        console.log(response.data);
        setFriends(users);
    }, [])

    useEffect(() => {
        getFriends();
        console.log(state.auth.token);
    }, [getFriends])

    const socket = io("http://localhost:3001", {auth: {
        token: 'Bearer ' + state.auth.token
    }});


        
    socket.on("message", (message: string) => {
        const currentMessages: string[] = testMessages;
        currentMessages.push(message);
        console.log(message);
        setTestMessages(currentMessages);
        if (testMessages != null) {
            setHasSent(true);
        }
        setHasSent(false);
        console.log(testMessages);
    })


    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (connectedToRoom) {
            socket.emit('message', room, message);
            setMessage("");
        }
        setMessage("");
    }

    const connectToChat = async (friend_id: number) => {
        const roomResponse = await axios.post<Room>('http://localhost:3001/connect', {friend_id, room_type: 'private'}, {headers: {
            Authorization: 'Bearer ' + state.auth.token
        }})
        console.log(roomResponse.data);
        console.log(roomResponse.data.users[1].nickname);
        socket.emit('join-room', roomResponse.data.name);
        setRoom(roomResponse.data);
        setConnectedToRoom(true);
    }

    return (
        <div>
            <Flex width="full" height="100vh" alignItems="center" justifyContent="center" backgroundColor="#45B69C">
                    <Box w="20%" h="80%" bg="#7293A0" ml={8} borderRadius={8} border="2px">
                        <Center>
                            <Heading mb={8}>Friends</Heading>
                        </Center>
                        <Menu>
                            {
                                friends.map((user) => {
                                    return <MenuItem mb={2} onClick={() => {connectToChat(user.id); setConnectedFriend(user.nickname)}}>
                                        <Avatar mr={8} name={user.nickname} src="" />
                                        <Text fontSize='2xl'>{user.nickname}</Text>
                                    </MenuItem>
                                })
                            }
                        </Menu>
                        
                    </Box>
                    <Spacer />
                    {connectedToRoom ? <Box w="70%" h="80%" bg="#7293A0" mr={8} borderRadius={8} border="2px">
                        <Heading ml={8} mt={4}>{connectedFriend}</Heading>
                        <Divider mt={6} />
                        <ScrollableFeed>
                            <MessageFeed messages={testMessages} />
                        </ScrollableFeed>
                        <form onSubmit={handleSubmit}>
                            <Input ml={10} width="80%" placeholder="Message...." bg="white" size="lg" value={message} onChange={(event) => setMessage(event.currentTarget.value)}/>
                            <Button ml={8} type="submit">Send</Button>
                        </form>
                    </Box> :
                     <Box w="70%" h="80%" bg="#7293A0" mr={8} borderRadius={8} border="2px">   
                            <Center h="80%">
                                <Heading>Click on one of your friends to chat with them!</Heading>
                            </Center>
                    </Box>
                    }
                    
            </Flex>
        </div>
    )
}

export default Chat;
