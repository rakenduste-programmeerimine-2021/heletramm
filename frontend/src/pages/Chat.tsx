import React from "react";
import { useState, useCallback, useEffect, useContext } from 'react';
import {io} from 'socket.io-client';
import axios from "axios";
import { Flex, Box, Heading, Spacer, HStack, VStack} from "@chakra-ui/layout";
import {chakra, Input, WrapItem, Avatar, Button, Text, Divider, Menu, Checkbox, MenuItem, Center, Popover, PopoverArrow, PopoverTrigger, PopoverContent
, PopoverBody, PopoverHeader, PopoverFooter, Portal, PopoverCloseButton} from "@chakra-ui/react";
import MessageFeed from "../components/MessageFeed";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/Index";
import ScrollableFeed from "react-scrollable-feed";
import { useToast } from "@chakra-ui/toast";
import { AiOutlinePlus } from "react-icons/ai";

export interface Props {
  onRenderingChat: (state: boolean) => void;
  onAddFriendChange: (friendId: string) => void;
  onMessageSubmit: (message: string) => void;
  onAddFriendToggle: (state: boolean) => void;
  onGetFriends: () => void;
}

const PlusSign = chakra(AiOutlinePlus);

const Chat: React.FC<Props> = (props: Props) => {

    interface Error {
        type: string,
        msg: string
    }

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
        friends: Friend[], 
        errors: Error[]
    }

    interface GroupsResponse {
        rooms: Group[]
    }

    interface Group {
        group_name: string,
        id: number,
        name: string,
        type: string
    }

    interface Room {
        id: number,
        name: string,
        type: string,
        users: User[]
    }

    interface ChatHistoryResponse {
        messages: Message[]
    }

    interface Message {
        id: number,
        message: string
    }

    //const navigate = useNavigate();

    const [testMessages, setTestMessages] = useState<string[]>([]);
    const [hasSent, setHasSent] = useState<boolean>(false);
    const [messagesSet, setMessagesSet] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [friendId, setFriendId] = useState<string>();
    const [user, setUser] = useState<User>();
    const [friends, setFriends] = useState<User[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [checkList, setCheckList] = useState<number[]>([]);
    const [groupRooms, setGroupRooms] = useState<User[][]>([]);
    const [connectedToRoom, setConnectedToRoom] = useState<boolean>(false);
    const [room, setRoom] = useState<Room>();
    const [connectedFriend, setConnectedFriend] = useState<string>("");
    const [addFriendToggled, setAddFriendToggled] = useState<boolean>(false);
    const [makeGroupToggled, setMakeGroupToggled] = useState<boolean>(false);
    const [state] = useContext(Context);

    const toast = useToast();

    const getChatHistory = async (room_id: number) => {
        const chatHistoryResponse = await axios.post<ChatHistoryResponse>("http://localhost:3001/history", {room_id: room_id}, {
            headers: {
               Authorization: 'Bearer ' + state.auth.token 
            }
        });

        testMessages.length = 0;
        setMessagesSet(false);

        chatHistoryResponse.data.messages.map((msg) => testMessages.push(msg.message));
        setMessagesSet(true);
    }

    const makeGroup = async(users: number[]) => {
        const groupResponse = await axios.post("http://localhost:3001/group/create", {user_ids: users}, {
            headers: {
               Authorization: 'Bearer ' + state.auth.token 
            }
        });

    }

    const getGroups = useCallback(async () => {
        const response = await axios.get<GroupsResponse>("http://localhost:3001/group/me", {
            headers: {
               Authorization: 'Bearer ' + state.auth.token 
            }
        });
        if (response.data != undefined) {

            const groups = response.data.rooms.map((group) => group);
            setGroups(groups);
        }
    }, [])

    const getFriends = useCallback(async () => {
        props.onGetFriends();
       const response = await axios.get<FriendsResponse>('http://localhost:3001/friend/me', {headers: {
            Authorization: 'Bearer ' + state.auth.token
        }})
        if (response.data != null && response.data != undefined) {
            const users = response.data.friends.map((friend) => friend.user);
            setFriends(users);
        }
    }, [])

    useEffect(() => {
        getGroups();
        getFriends();
    }, [getFriends, state.auth.token])

    const socket = io("http://localhost:3001", {auth: {
        token: 'Bearer ' + state.auth.token
    }});

    socket.on("message", (message: string) => {
        const currentMessages: string[] = testMessages;
        currentMessages.push(message);
        setTestMessages(currentMessages);
        if (testMessages != null) {
            setHasSent(true);
        }
        setHasSent(false);
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
        if (roomResponse.data.name != null) {

            setRoom(roomResponse.data);
            setConnectedToRoom(true);
            getChatHistory(roomResponse.data.id);
            toast({
                title: 'Connected',
                description: "You are connected to the chat!",
                status: 'success',
                duration: 1000,
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

    const handleCheckbox = async (checked: boolean, userid: number) => {

        if (checked == true) {
        setCheckList([...checkList, userid]);
        } else {
        const selectedUser = checkList.filter(a => {
            if (a === userid) return false;
            return true;
        });
        setCheckList([...selectedUser]);
        }
    }

    return (
        <div>
            <Flex width="full" height="100vh" alignItems="center" justifyContent="center" backgroundColor="#0077B6">
                    <Box w="20%" h="80%" bg="#0096C7" ml={8} borderRadius={8} borderColor="#023E8A" borderWidth={4}>
                        <Center>
                            <Heading mt={8} mb={8}>Friends</Heading>
                        </Center>
                        <Menu>
                            <ScrollableFeed>
                                {
                                    friends.map((user) => {
                                        return <MenuItem data-testid="friend" p={6} mb={4} ml={4} width="90%" borderRadius={8} bg="#0077B6" _focus={{ background: "#CAF0F8" }}  onClick={() => {connectToChat(user.id); setConnectedFriend(user.username)}}>
                                            <Avatar mr={8} name={user.username} src="" />
                                            <Text fontSize='2xl'>{user.username}</Text>
                                        </MenuItem>
                                    })
                                }
                                <Divider mt={8} mb={8} />
                                {
                                    groups.map((group) => {
                                        return <MenuItem data-testid="group" p={6} mb={4} ml={4} width="90%" borderRadius={8} bg="#0077B6" _focus={{ background: "#CAF0F8" }}  onClick={() => {connectToChat(group.id); setConnectedFriend(group.group_name)}}>
                                            <Avatar mr={8} name={group.group_name} src="" />
                                            <Text fontSize='2xl'>{group.group_name}</Text>
                                        </MenuItem>
                                    })
                                }

                                <Center>
                                
                                    {addFriendToggled ?
                                        <Center>
                                            <VStack>
                                                <Text fontSize="xl">Insert your friend's ID!</Text>
                                                <Input data-testid="friendid" width='80%' placeholder='ID' bg='white' size="lg" onChange={(event) => setFriendId(event.currentTarget.value)} />
                                                <Button data-testid="addfriendsubmit" onClick={handleAddFriend}>Add</Button>
                                            </VStack>
                                        </Center> :
                                        <Button p={4} data-testid="addfriendtoggle" onClick={() => {setAddFriendToggled(true); props.onAddFriendToggle(true)}}>Add friend</Button>
                                    }
                      
                                </Center>
                            </ScrollableFeed>
                            
                        </Menu>
                        
                    </Box>
                    <Spacer />
                    {connectedToRoom ? 
                    <Box w="70%" h="80%" bg="#ADE8F4" mr={8} borderRadius={8} borderColor="#48CAE4" borderWidth={4}>
                        <HStack borderRadius="2px" alignItems="baseline" pt={4} paddingBottom={4} bg="blue.500" br={8}>
                            <Avatar ml={8} mr={8} name={connectedFriend} src="" />
                            <Heading>{connectedFriend}</Heading>
                            <Spacer />
                            <Popover placement="right">
                                <PopoverTrigger>
                                    <Button mb={4} data-testid="makegrouptoggle">
                                        Make group<PlusSign marginLeft={4}/>
                                    </Button>
                                </PopoverTrigger>
                                <Portal>
                                    <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverHeader>Click on friend to add to group!</PopoverHeader>
                                        <PopoverCloseButton />
                                        <PopoverBody mt={4}>
                                            <Menu>
                                                <ScrollableFeed>
                                                    {
                                                        friends.map((user) => {
                                                            return <MenuItem data-testid="friend" mb={4} ml={4} width="90%" borderRadius={8} bg="#0077B6" _focus={{ background: "#CAF0F8" }}>
                                                                <Checkbox mr={4} size='lg' colorScheme='green' value={user.id} onChange={(e) => handleCheckbox(e.currentTarget.checked, user.id)}></Checkbox>
                                                                <Avatar mr={8} name={user.username} src="" />
                                                                <Text fontSize='2xl'>{user.username}</Text>
                                                            </MenuItem>
                                                        })
                                                    }
                                                </ScrollableFeed>
                                            </Menu>
                                           
                                        </PopoverBody>
                                        <Center>
                                            <Button mb={4} bg="#21D19F" onClick={() => makeGroup(checkList)}>Make group</Button>
                                        </Center>
                                    </PopoverContent>
                                </Portal>
                            </Popover>
                            
                            
                        </HStack>
                        <ScrollableFeed>
                            <MessageFeed messages={testMessages} />
                        </ScrollableFeed>
                        <form onSubmit={handleSubmit}>
                            <Input ml={10} width="80%" placeholder="Message...." bg="white" size="lg" value={message} onChange={(event) => setMessage(event.currentTarget.value)}/>
                            <Button alignSelf="center" width="8%" ml={8} backgroundColor="#0077B6" type="submit">Send</Button>
                        </form>
                    </Box> :
                     <Box w="70%" h="80%" bg="#0077B6" mr={8} borderRadius={8} borderColor="#48CAE4" borderWidth={4}>   
                            <Center h="80%">
                                <Heading data-testid="welcomemessage">Click on one of your friends or groups to chat with them!</Heading>
                            </Center>
                    </Box>
                    } 
                    
                    
            </Flex>
        </div>
    )
}

export default Chat;
