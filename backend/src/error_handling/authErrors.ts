import {Request, Response, NextFunction} from 'express';

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