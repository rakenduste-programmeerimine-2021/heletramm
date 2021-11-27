import { Socket } from "socket.io";
import * as chatController from '../controllers/chatController';

export const userHandler = (socket: Socket) => {
    socket.on('disconnect', chatController.userDisconnected);
    socket.on('message', (room_name: string, message: string) => chatController.userMessage(socket, room_name, message));
    socket.on('join-room', (room_name: string) => chatController.connectToRoom(socket, room_name));
}