import { Response } from "express";
import { ReqWithUser } from "../middleware/authorization";
import {Socket} from 'socket.io';
import { ReqChat } from "../middleware/chatMiddleware";

//Socket.io routes
export const userDisconnected = (reason: string) => {
    console.log(`User disconnected, reason: ${reason}`);
}

export const userMessage = (socket: Socket, room_name: string, message: string) => {
    socket.to(room_name).emit(message);
    console.log(message);
}

export const connectToRoom = (socket: Socket, room_name: string) => {
    console.log('user joined a room');
    socket.join(room_name);
}

//REST routes
export const initChatConnection = (req: ReqChat, res: Response) => {
    res.json(req.room);
    return;
}