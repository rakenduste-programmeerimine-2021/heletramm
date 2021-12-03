import { Response } from "express";
import {Socket} from 'socket.io';
import { getConnection } from "typeorm";
import { ReqChat } from "../middleware/chatMiddleware";
import { Message } from "../model/Message";

//Socket.io routes
export const userDisconnected = (reason: string) => {
    console.log(`User disconnected, reason: ${reason}`);
}

export const userMessage = (socket: Socket, room_name: string, message: string) => {
    socket.to(room_name).emit('message', message);
    const messageRepository = getConnection().getRepository(Message);

}

export const connectToRoom = (socket: Socket, room_name: string) => {
    socket.join(room_name);
}

//REST routes
export const initChatConnection = (req: ReqChat, res: Response) => {
    res.status(200).json(req.room);
    return;

}