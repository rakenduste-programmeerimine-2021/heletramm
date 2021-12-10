import { NextFunction, Request, Response } from "express";
import { getConnection, Like } from "typeorm";
import { Friend } from "../model/Friend";
import { User } from "../model/User";
import { AlreadyFriendError, NoUsersFound } from "../error_handling/friendErrors";


export const AddFriend = async (req: Request, res: Response, next: NextFunction) => {

    const {friend_id} = req.body;

    const connection = getConnection();
    const userRepository = connection.getRepository(User);
    const friendRepository = connection.getRepository(Friend);
    const me = await userRepository.findOne({id: req.user.id});
    if (!me) throw Error("Me not found");

    const friendExists = await friendRepository.findOne({friend_of: me});

    if (friendExists) next(new AlreadyFriendError());

    const friendToAdd = await userRepository.findOne({id: friend_id});
    if (!friendToAdd) throw new Error('');



    const friendEntry = new Friend();

    friendEntry.friend_of = me;
    friendEntry.user = friendToAdd;

    await friendRepository.save(friendEntry);

    res.status(200).json({
        message: "Friend added successfully"
    })

}

export const MyFriends = async (req: Request, res: Response) => {
    const connection = getConnection();
    const userRepository = connection.getRepository(User);
    const friendRepository = connection.getRepository(Friend);

    const me = await userRepository.findOne({id: req.user.id});
    if (!me) throw Error("Me not found (not possible)");


    //Teha juurde friend requesti systeem, ehk siis kui
    //vastupidist kirjet ei ole siis on soprus ainult yhepoolne :(
    const friends = await friendRepository.find({relations: ['user'], where: {
        friend_of: me
    }});


    res.status(200).json({friends});
}


export const Find = async (req: Request, res: Response, next: NextFunction)  => {
    const {username} = req.body;
    const userRepository = getConnection().getRepository(User);

    const users = await userRepository.find({username: Like(`%${username}%`)});
    
    if (users.length < 1) return next(new NoUsersFound());

    res.status(200).send([...users]);

}