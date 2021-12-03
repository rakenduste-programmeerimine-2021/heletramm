import { Response } from "express";
import {Socket} from 'socket.io';
import { ReqChat } from "../middleware/chatMiddleware";

//Socket.io routes
export const userDisconnected = (reason: string) => {
    console.log(`User disconnected, reason: ${reason}`);
}

export const userMessage = (socket: Socket, room_name: string, message: string) => {
    socket.to(room_name).emit('message', message);

    console.log(message);

}

export const connectToRoom = (socket: Socket, room_name: string) => {
    socket.join(room_name);
}

//REST routes
export const initChatConnection = (req: ReqChat, res: Response) => {
    res.status(200).json(req.room);
    return;

}