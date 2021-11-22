import React, { useState } from 'react';
import {io} from 'socket.io-client';

const TestChat: React.FC = () => {
    const [message, setMessage] = useState<string>("");

    const socket = io("http://localhost:3001");

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        socket.emit('message', message);
        setMessage("");
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
        </>
    )
}

export default TestChat;