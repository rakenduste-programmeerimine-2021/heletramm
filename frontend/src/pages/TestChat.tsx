import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import {io} from 'socket.io-client';

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

const TestChat: React.FC = () => {
    const [message, setMessage] = useState<string>("");
    const [friends, setFriends] = useState<User[]>([]);
    const [connectedToRoom, setConnectedToRoom] = useState<boolean>(false);

    const getFriends = useCallback(async () => {
        const response = await axios.get<FriendsResponse>("http://localhost:3001/friend/me", {headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywibmlja25hbWUiOiJ0ZXN0dXNlcjMiLCJpYXQiOjE2Mzc5MzA2NTYsImV4cCI6MTYzNzkzNDI1Nn0.HbCDwmpWz6LAusKvoBMGTFixguQTleuP5SR1gk2wj3I'
        }});
        const users = response.data.friends.map((friend) => friend.user);
        console.log(users);
        setFriends(users);
    }, [])

    useEffect(() => {
        getFriends()
    }, [getFriends])

    const socket = io("http://localhost:3001");

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (connectedToRoom) {
            socket.emit('message', message);
            setMessage("");
        }
    }

    const connectToChat = async (friend_id: number) => {
        const roomResponse = await axios.post<Room>('http://localhost:3001/connect', {friend_id, room_type: 'private'}, {headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywibmlja25hbWUiOiJ0ZXN0dXNlcjMiLCJpYXQiOjE2Mzc5MzA2NTYsImV4cCI6MTYzNzkzNDI1Nn0.HbCDwmpWz6LAusKvoBMGTFixguQTleuP5SR1gk2wj3I'
        }})
        console.log(roomResponse.data);
        socket.emit('join-room', roomResponse.data.name);
        setConnectedToRoom(true);
    }

    return(
        <>
        <h1>Testchat</h1>
        <ul>
            <li>Test chat 1</li>
            <li>Test chat 2</li>
        </ul>
        <form onSubmit={handleSubmit}>
            <input id="msg-box" style={{border: "1px solid black"}} onChange={(e) => setMessage(e.target.value)} value={message}></input>
            <button type="submit">Send msg</button>
        </form>
        <ul>
            <h5>Users:</h5>
            {
                friends.map((user) => {
                    return <li onClick={() => connectToChat(user.id)}>{user.nickname}</li>
                })
            }
        </ul>
        </>
    )
}

export default TestChat;