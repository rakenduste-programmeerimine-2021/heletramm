import {Request, Response, NextFunction} from 'express';
import { ApiRequestError } from './friendErrors';

export class AuthError extends ApiRequestError {
    constructor(message: string, type: string, statusCode: number) {
        super(message, type, statusCode);
    }
}

export class NotLoggedError extends AuthError {
    constructor() {
        super("You are not logged in!", "NotLoggedError", 401);
    }
}

export class UserNotFoundError extends AuthError {
    constructor() {
        super("User not found", "UserNotFoundError", 404);
    }
}


export const authErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AuthError) {
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