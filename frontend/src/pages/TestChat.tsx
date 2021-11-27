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
    const [roomName, setRoomName] = useState<string>("");

    const getFriends = useCallback(async () => {
        const response = await axios.get<FriendsResponse>("http://localhost:3001/friend/me", {headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywibmlja25hbWUiOiJ0ZXN0MyIsImlhdCI6MTYzNzk5NjQxNCwiZXhwIjoxNjM4MDAwMDE0fQ.Fyp2xvxsU6tge-qK8YeSIwTb1hNHVMJqs4D4mDXKf2w'
        }});
        const users = response.data.friends.map((friend) => friend.user);
        console.log(users);
        setFriends(users);
    }, [])

    useEffect(() => {
        getFriends()
    }, [getFriends])

    const socket = io("http://localhost:3001", {auth: {
        token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywibmlja25hbWUiOiJ0ZXN0MyIsImlhdCI6MTYzNzk5NjQxNCwiZXhwIjoxNjM4MDAwMDE0fQ.Fyp2xvxsU6tge-qK8YeSIwTb1hNHVMJqs4D4mDXKf2w'
    }});

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (connectedToRoom) {
            socket.emit('message', roomName, message);
            setMessage("");
        }
    }

    const connectToChat = async (friend_id: number) => {
        const roomResponse = await axios.post<Room>('http://localhost:3001/connect', {friend_id, room_type: 'private'}, {headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywibmlja25hbWUiOiJ0ZXN0MyIsImlhdCI6MTYzNzk5NjQxNCwiZXhwIjoxNjM4MDAwMDE0fQ.Fyp2xvxsU6tge-qK8YeSIwTb1hNHVMJqs4D4mDXKf2w'
        }})
        console.log(roomResponse.data);
        socket.emit('join-room', roomResponse.data.name);
        setRoomName(roomResponse.data.name);
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