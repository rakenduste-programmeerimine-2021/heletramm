import { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";
import { body } from "express-validator";
import { getConnection } from "typeorm";
import { Room } from "../model/Room";
import { User } from "../model/User";
import { Friend } from '../model/Friend';
import { ReqWithUser } from "./authorization";
import {AlreadyFriendError} from '../error_handling/friendErrors';

const validationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    next();

}

export const registerValidation: ValidationChain[] = [
        body('username')
            .isLength({min: 3})
            .withMessage("Username must be atleast 3 characters")
            .custom(async (username: string) => {
                const userRepository = getConnection().getRepository(User);
                const user = await userRepository.findOne({username});
                if (user) throw new Error("Username already exists");
            }),
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage("Must be an email")
            .custom(async (email: string) => {
                const userRepository = getConnection().getRepository(User);
                const user = await userRepository.findOne({email});
                if (user) throw new Error("Email already exists")
            }),
        body('password')
            .isLength({min: 4})
            .withMessage("Password must be atleast 4 characters long")
];

export const loginValidation: ValidationChain[] = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .custom(async (email: string) => {
            const userRepository = getConnection().getRepository(User);
            const user = await userRepository.findOne({email});

            if (!user) throw new Error("User doesn't exist");
        }),
]

export const friendAddValidation: ValidationChain[] = [
    body('friend_id')
        .isInt({min: 0})
        .custom(async (friend_id: number, {req}) => {
            const userRepository = getConnection().getRepository(User);
            const friendRepository = getConnection().getRepository(Friend);
            const user = await userRepository.findOne({id: friend_id});

            if (!user) throw new Error("User doesn't exist");

            const me = await userRepository.findOne({id: req.user.id})
            const friendExists = await friendRepository.findOne({friend_of: me});
            if (friendExists) throw new AlreadyFriendError()

    })
]



export const chatHistoryValidation: ValidationChain[] = [
    body('room_id')
        .isInt({min: 0})
        .custom(async (room_id: number, meta) => {
            const req = meta.req as ReqWithUser;
            const roomRepository = getConnection().getRepository(Room);
            const {users} = await roomRepository.findOne({
                relations: ['users'],
                where: {id: room_id}
            });
            
            const user_ids = users.map((user) => user.id);
            if (!user_ids.includes(req.user.id)) {
                throw Error("You are not allowed to access this chat");
            }

        })
];

export default validationMiddleware;