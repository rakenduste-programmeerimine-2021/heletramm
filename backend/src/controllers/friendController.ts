import { Response } from "express";
import { getConnection } from "typeorm";
import { UserNotFoundError } from "../error_handling/authErrors";
import { ReqWithUser } from "../middleware/authorization";
import { Friend } from "../model/Friend";
import { User } from "../model/User";


export const AddFriend = async (req: ReqWithUser, res: Response) => {
    const {friend_id} = req.body;

    const connection = getConnection();
    const userRepository = connection.getRepository(User);
    const friendRepository = connection.getRepository(Friend);

    const friendToAdd = await userRepository.findOne({id: friend_id});
    if (!friendToAdd) throw new Error('');
      

    const me = await userRepository.findOne({id: req.user.id});
    if (!me) throw Error("Me not found");


    const friendEntry = new Friend();

    friendEntry.friend_of = me;
    friendEntry.user = friendToAdd;

    await friendRepository.save(friendEntry);

    res.status(200).json({
        message: "Friend added successfully"
    })

}

export const MyFriends = async (req: ReqWithUser, res: Response) => {
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
