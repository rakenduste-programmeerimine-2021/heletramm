import { Response } from "express";
import { ReqWithUser } from "../middleware/authorization";

//Socket.io routes
export const userDisconnected = (reason: string) => {
    console.log(`User disconnected, reason: ${reason}`);
}

export const userMessage = (message: string) => {
    console.log(message);
}

//REST routes
export const initChatConnection = (req: ReqWithUser, res: Response) => {
    return;
}