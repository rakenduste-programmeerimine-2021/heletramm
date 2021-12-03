import { Socket } from "socket.io";
import * as chatController from '../controllers/chatController';
import { Room } from "../model/Room";

export const userHandler = (socket: Socket) => {
    socket.on('disconnect', chatController.userDisconnected);
    socket.on('message', (room: Room, message: string) => chatController.userMessage(socket, room, message));
    socket.on('join-room', (room_name: string) => chatController.connectToRoom(socket, room_name));
}