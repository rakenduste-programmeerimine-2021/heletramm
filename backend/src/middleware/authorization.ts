import { NextFunction, Response } from "express";
import { Request } from "express";
import { verify } from "jsonwebtoken";

export interface TokenUser {
    id: number,
    nickname: string
}

interface ReqWithUser extends Request {
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