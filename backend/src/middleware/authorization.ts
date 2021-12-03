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

export class NotLoggedError extends Error {
    public statusCode: number;
    constructor() {
        super("You are not logged in!");
        this.name = "NotLoggedError";
        this.statusCode = 401;
    }
}

export const authErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof NotLoggedError) {
        return res.status(err.statusCode).json({
            errors: [
                {
                    type: err.name,
                    msg: err.message
                }
            ]
        })
    }
    next(err);
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