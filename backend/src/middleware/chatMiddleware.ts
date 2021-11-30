import { NextFunction, Response } from "express";
import { getConnection } from "typeorm";
import { Room } from "../model/Room";
import { User } from "../model/User";
import { ReqWithUser } from "./authorization";
import {RoomType} from '../model/Room';


/*
*** Before production fix those me and friend errors
*/

export interface ReqChat extends ReqWithUser {
    room?: Room
}

export const InitChat = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    const {room_type} = req.body;

    if (room_type === RoomType.PRIVATE) {
        InitPrivateChat(req, res, next);
    }
    else if (room_type === RoomType.GROUP) {
        //InitGroupChat
    }
    else {
        res.status(404).json({
            error: "Specify room type"
        });
    }
}

export const InitPrivateChat = async (req: ReqChat, res: Response, next: NextFunction) => {
    const {friend_id} = req.body;

    const roomRepository = getConnection().getRepository(Room);
    const userRepository = getConnection().getRepository(User);

    const me = await userRepository.findOne({id: req.user.id});
    if (!me) throw Error("Something went wrong (me not found: InitPrivateChat)");

    const friend = await userRepository.findOne({id: friend_id});
    if (!friend) throw Error("Something went wrong (friend not found: InitPrivateChat)");

    const rooms = await roomRepository.find({relations: ['users'], where: {type: "private"}});
    const room = rooms.filter((room) => {
        let hasUsers = true;
        [me, friend].forEach((user) => {
            const roomUserIds = room.users.map((user) => user.id);
            if (!roomUserIds.includes(user.id)) {
                hasUsers = false
            } else {
            }
        })
        return hasUsers;
    })


    if (room.length < 1) {
        const newRoom = new Room();
        newRoom.name = me.nickname + friend.nickname + RoomType.PRIVATE;
        newRoom.type = RoomType.PRIVATE;
        newRoom.users = [friend, me];
        const savedRoom = await roomRepository.save(newRoom);
        req.room = savedRoom;
    }
    else {

        req.room = room[0];
    }
    next();

}