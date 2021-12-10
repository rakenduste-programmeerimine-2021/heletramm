import { NextFunction, Response, Request } from "express";
import { getConnection, In } from "typeorm";
import { Room, RoomType } from "../model/Room";


export const CreateGroup = async (req: Request, res: Response, next: NextFunction) => {
    const users = req.group_users;
    const roomRepository = getConnection().getRepository(Room);

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

export const MyGroups = async (req: Request, res: Response, next: NextFunction) => {
    const connection = getConnection();
    const roomRepository = connection.getRepository(Room);

    const rooms = await roomRepository.createQueryBuilder("room")
    .leftJoin("room.users", "users")
    .where("room.type = :room_type AND room_users.userId = :user_id", {room_type: RoomType.GROUP, user_id: req.user.id}) 
    .printSql()
    .getMany();

    return res.status(200).json(rooms);
}

export const AddToGroup = async (req: Request, res: Response, next: NextFunction) => {
    return
}
