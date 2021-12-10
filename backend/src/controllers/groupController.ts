import { NextFunction, Response } from "express";
import { getConnection } from "typeorm";
import { NoUsersFound } from "../error_handling/friendErrors";
import { ReqWithUser } from "../middleware/authorization";
import { Room, RoomType } from "../model/Room";
import { User } from "../model/User";

export const CreateGroup = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    const {group_name, user_ids} = req.body

    const connection = getConnection();

    const roomRepository = connection.getRepository(Room);
    const userRepository = connection.getRepository(User);

    const users: User[] = user_ids.map(async (user_id: number) => {
        const user = await userRepository.findOne({id: user_id});
        if (!user) return next(new NoUsersFound());
        return user;
    });

    const room = new Room();
    let defaultGroupName = users[0].username;

    for (let i = 1; i < users.length; ++i) {
        defaultGroupName += ', ' + users[i].username;
    }

    room.group_name = defaultGroupName;

    for (let i = 0; i < users.length; ++i) {
        room.name += users[i].username;
    }
    room.name += RoomType.GROUP;
    room.type = RoomType.GROUP;

    room.users = users;

    await roomRepository.save(room);

    return res.status(200).json({message: "Group created successfully"});
}

export const MyGroups = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    return
}

export const AddToGroup = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    return
}