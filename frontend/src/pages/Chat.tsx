import React from "react";
import { useState, useCallback, useEffect, useContext } from 'react';
import {io} from 'socket.io-client';
import axios from "axios";
import { Flex, Box, Heading, Spacer, ListItem} from "@chakra-ui/layout";
import {List, Input, WrapItem, Avatar, Button, Text, Divider, Menu, MenuButton, MenuItem, Link} from "@chakra-ui/react";
import MessageBox from "../components/Message";
import MessageFeed from "../components/MessageFeed";
import { useNavigate } from "react-router-dom";
import { Context } from "../store";
import ScrollableFeed from "react-scrollable-feed";

const Chat: React.FC = () => {

    // Teha if statement, kas on logged in v ei, selle jargi muuta avatarbadge varvi

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
    const [roomName, setRoomName] = useState<string>("");
    const [state, dispatch] = useContext(Context);

    const ChangeRoute = () => {
        const path = "/login";
        navigate(path);
    }

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
            socket.emit('message', roomName, message);
            setMessage("");
        }
    }

    const connectToChat = async (friend_id: number) => {
        const roomResponse = await axios.post<Room>('http://localhost:3001/connect', {friend_id, room_type: 'private'}, {headers: {
            Authorization: 'Bearer ' + state.auth.token
        }})
        console.log(roomResponse.data);
        socket.emit('join-room', roomResponse.data.name);
        setRoomName(roomResponse.data.name);
        setConnectedToRoom(true);
    }



    return (
        <div>
            <Flex width="full" height="100vh" alignItems="center" justifyContent="center" backgroundColor="#45B69C">
                    <Box w="20%" h="80%" bg="#7293A0" ml={8} borderRadius={8} border="2px">
                        <Heading ml={24}>Contacts</Heading>
                        <Menu>
                            {
                                friends.map((user) => {
                                    return <MenuItem onClick={() => connectToChat(user.id)}>{user.nickname}<Avatar name={user.nickname} src="https://via.placeholder.com/150" /></MenuItem>
                                })
                            }
                        </Menu>
                        
                    </Box>
                    <Spacer />
                    <Box w="70%" h="80%" bg="#7293A0" mr={8} borderRadius={8} border="2px">
                        <Heading ml={8} mt={4}>Username</Heading>
                        <Divider mt={6} />
                        <ScrollableFeed>
                            <MessageFeed messages={testMessages} />
                        </ScrollableFeed>
                        <form onSubmit={handleSubmit}>
                            <Input ml={10} width="80%" placeholder="Message...." bg="white" size="lg" onKeyPress={(event) => setMessage(event.currentTarget.value)}/>
                            <Button ml={8} type="submit">Send</Button>
                        </form>
                    </Box>
            </Flex>
        </div>
    )
}

export default Chat;
