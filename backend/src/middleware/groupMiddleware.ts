import { NextFunction, Request, Response } from "express";
import { getConnection } from "typeorm";
import { User } from "../model/User";
import { NoUsersFound } from "../error_handling/friendErrors";

export const PrepareUsers = async (req: Request, res: Response, next: NextFunction) => {
    const {user_ids} = req.body;
    const connection = getConnection();

    const userRepository = connection.getRepository(User);

    const me = await userRepository.findOne({id: req.user.id});

    const users: User[] = await Promise.all(user_ids.map(async (user_id: number) => {
        const user = await userRepository.findOne({id: user_id});
        if (!user) return next(new NoUsersFound());
        return user;
    }));

    users.push(me);
    req.group_users = users;
    next();
}
