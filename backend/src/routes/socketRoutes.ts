import { Socket } from "socket.io";
import * as chatController from '../controllers/chatController';

export const userHandler = (socket: Socket) => {
    socket.on('disconnect', chatController.userDisconnected);
    socket.on('message', chatController.userMessage);
}