import { NextFunction, Response } from "express";
import { Request } from "express";
import { verify } from "jsonwebtoken";
import { Socket } from "socket.io";

export interface TokenUser {
    id: number,
    nickname: string
}

export interface ReqWithUser extends Request {
    user?: TokenUser
}

export const authMiddleware = (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        if (!req.headers.authorization) throw new Error("Access denied!");

        const token = req.headers.authorization.split(" ")[1];
        const decoded = verify(token, process.env.JWT_SECRET) as TokenUser;
        
        req.user = decoded;

        next();
    } catch (err) {
        res.status(401).send({
            error: "Access denied!"
        })
    }
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