import { NextFunction, Request, Response } from "express";

export class ApiRequestError extends Error {
    public statusCode: number;

    constructor(message: string, type: string, statusCode: number) {
        super(message)
        this.name = type;
        this.statusCode = statusCode;
    }
}

export class FriendError extends ApiRequestError {
    constructor(message: string, type: string, statusCode: number) {
        super(message, type, statusCode);
    }
}


export class AlreadyFriendError extends FriendError {
    constructor() {
        super("Friend already added", "AlreadyFriendError", 406);
    }
}

export const FriendErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof FriendError) {
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