import { Request, Response } from "express";
import {Socket} from 'socket.io';
import { getConnection } from "typeorm";
import { Message } from "../model/Message";
import { Room } from "../model/Room";
import { User } from "../model/User";


//Socket.io routes
export const userDisconnected = (reason: string) => {
    console.log(`User disconnected, reason: ${reason}`);
}


export const userMessage = (socket: Socket, room: Room, message: string) => {
    socket.to(room.name).emit('message', message);
    //Save message to database
    if (message) {
        const user = socket.handshake.auth.user as User;
        const messageRepository = getConnection().getRepository(Message);
        const newMessage = new Message();
        newMessage.message = message;
        newMessage.room = room;
        newMessage.user = user;
        messageRepository.save(newMessage);

    }
}

export const chatHistory = async (req: Request, res: Response) => {
    const {room_id} = req.body;
    const roomRepository = getConnection().getRepository(Message);
    const messages = await roomRepository.find({room: room_id});

    res.status(200).send({
        messages
    });
}

export const connectToRoom = (socket: Socket, room_name: string) => {
    socket.join(room_name);
}

//REST routes
export const initChatConnection = (req: Request, res: Response) => {
    res.status(200).json(req.room);
    return;

}