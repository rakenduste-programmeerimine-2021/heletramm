import { NextFunction, Response } from "express";
import { Request } from "express";
import { verify } from "jsonwebtoken";
import { Socket } from "socket.io";
import { NotLoggedError } from "../error_handling/authErrors";

export interface TokenUser {
    id: number,
    nickname: string
}

export interface ReqWithUser extends Request {
    user?: TokenUser
}

export const authMiddleware = (req: ReqWithUser, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) throw new NotLoggedError();

    const token = req.headers.authorization.split(" ")[1];
    const decoded = verify(token, process.env.JWT_SECRET) as TokenUser;
    
    req.user = decoded;

    next();
}

export const socketAuthMiddleware = (socket: Socket, next) => {
    try {
        if (!socket.handshake.auth.token) throw new Error("You are not authenticated!");

        const token = socket.handshake.auth.token.split(" ")[1];
        const decoded = verify(token, process.env.JWT_SECRET) as TokenUser;
        socket.handshake.auth.user = decoded;
        next()
    }
    catch (err) {
        next(new Error("You are not authenticated"))
    }
}