import { NextFunction, Response } from "express";
import { getConnection } from "typeorm";
import { Room } from "../model/Room";
import { User } from "../model/User";
import { ReqWithUser } from "./authorization";
import {RoomType} from '../model/Room';


/*
*** Before production fix those me and friend errors
*/

export const InitChat = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    const {room_type} = req.body;

    if (room_type === RoomType.PRIVATE) {
        InitPrivateChat(req, res, next);
    }
    else if (room_type === RoomType.GROUP) {
        //InitGroupChat
    }
}

export const InitPrivateChat = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    const {friend_id} = req.body;

    const roomRepository = getConnection().getRepository(Room);
    const userRepository = getConnection().getRepository(User);

    const me = await userRepository.findOne({id: req.user.id});
    if (!me) throw Error("Something went wrong (me not found: InitPrivateChat)");

    const friend = await userRepository.findOne({id: friend_id});
    if (!friend) throw Error("Something went wrong (friend not found: InitPrivateChat)");

    const room = await roomRepository.find({users: [me, friend]});

    if (!room) {
        const newRoom = new Room();
        newRoom.name = me.nickname + friend.nickname + RoomType.PRIVATE;
        newRoom.type = RoomType.PRIVATE;
        newRoom.users = [friend, me];
        await roomRepository.save(newRoom);
        next();
    }

    next();

}