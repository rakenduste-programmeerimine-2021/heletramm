import React from "react";
import { useState, useCallback, useEffect, useContext } from 'react';
import {io} from 'socket.io-client';
import axios from "axios";
import { Flex, Box, Heading, Spacer, ListItem, VStack} from "@chakra-ui/layout";
import {List, Input, WrapItem, Avatar, Button, Text, Divider, Menu, MenuButton, MenuItem, Center} from "@chakra-ui/react";
import MessageBox from "../components/Message";
import MessageFeed from "../components/MessageFeed";
import { useNavigate } from "react-router-dom";
import { Context } from "../store";
import ScrollableFeed from "react-scrollable-feed";
import { useToast } from "@chakra-ui/toast";

export interface Props {
  onMessageChange: (message: string) => void;
  onConnectingToChat: (friendId: string) => void;
  onAddFriendChange: (friendId: string) => void;
  onMessageSubmit: (message: string) => void;
  onAddFriendSubmit: (friendId: number) => void;
}

const Chat: React.FC<Props> = (props: Props) => {

    interface User {
    id: number,
    username: string,
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

    //const navigate = useNavigate();

    const [testMessages, setTestMessages] = useState<string[]>([]);
    const [hasSent, setHasSent] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [friendId, setFriendId] = useState<string>();
    const [friends, setFriends] = useState<User[]>([]);
    const [connectedToRoom, setConnectedToRoom] = useState<boolean>(false);
    const [room, setRoom] = useState<Room>();
    const [connectedFriend, setConnectedFriend] = useState<string>("");
    const [addFriendToggled, setAddFriendToggled] = useState<boolean>(false);
    const [state] = useContext(Context);

    const toast = useToast();

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
        console.log(addFriendToggled);
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

        props.onMessageSubmit(message);

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
        console.log(roomResponse.data.name);
        console.log(roomResponse.data.users[1].username);
        if (roomResponse.data.name != null) {

            setRoom(roomResponse.data);
            setConnectedToRoom(true);
            toast({
                title: 'Connected',
                description: "You are connected to the chat!",
                status: 'success',
                duration: 9000,
                isClosable: true,
                position: "top-right"
            })
        }
        socket.emit('join-room', roomResponse.data.name);
    }

    const handleAddFriend = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const addFriendResponse = await axios.post('http://localhost:3001/friend/add', {
            friend_id: friendId
        }, {headers: {
            Authorization: 'Bearer ' + state.auth.token
        }})

        toast({
            title: 'Friend added!',
            description: addFriendResponse.data.message,
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: "top-right"
        })

        console.log(addFriendResponse.data);

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
                                    return <MenuItem data-testid="friend" mb={2} onClick={() => {connectToChat(user.id); setConnectedFriend(user.username)}}>
                                        <Avatar mr={8} name={user.username} src="" />
                                        <Text fontSize='2xl'>{user.username}</Text>
                                    </MenuItem>
                                })
                            }
                            <Center>
                                
                                {addFriendToggled ?
                                    <Center>
                                        <VStack mt={4}>
                                            <Text fontSize="xl">Insert your friend's ID!</Text>
                                            <Input data-testid="friendid" width='80%' placeholder='ID' bg='white' size="lg" onChange={(event) => setFriendId(event.currentTarget.value)} />
                                            <Button onClick={handleAddFriend}>Add</Button>
                                        </VStack>
                                    </Center> : <Button data-testid="addfriendtoggle" onClick={() => setAddFriendToggled(true)}>Add friend</Button>
                                }
                      
                            </Center>
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
