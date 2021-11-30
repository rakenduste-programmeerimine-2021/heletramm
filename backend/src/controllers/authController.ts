import { Request, Response } from "express";
import {getConnection, getRepository} from 'typeorm';
import {User} from '../model/User';
import {hash, genSalt, compare} from 'bcrypt';
import {sign} from 'jsonwebtoken';
import {ReqWithUser, TokenUser} from '../middleware/authorization';
import {verify} from 'jsonwebtoken';

interface RefreshTokenResponse {
    success: boolean,
    token?: string
}

export const GetUsers = async (req: Request, res: Response) => {
    const connection = getConnection();
    const userRepository = connection.getRepository(User);
    const users = await userRepository.find();
    res.json(users);
}

export const Logout = async (req: ReqWithUser, res: Response) => {
    if (req.user) {
        res.cookie('jid', {}, {httpOnly: true});
    }
}

export const RefreshToken = async (req: Request, res: Response) => {

    const token = req.cookies.jid;

    //Kui tokenit pole siis 2ra tee midagi
    if (!token) {
        const response: RefreshTokenResponse = {
            success: false,
            token: null
        }
        res.send(response);
    }

    const decoded = verify(token, process.env.REFRESH_SECRET) as TokenUser;
    //Kui ei kehti siis lase uuesti sisse logida/ 2ra saada midagi tagasi
    if (!decoded) {
        const response: RefreshTokenResponse = {
            success: false,
            token: null
        }
        res.send(response);
    }
    
    const response: RefreshTokenResponse = {
        success: true,
        token: sign(decoded, process.env.JWT_SECRET)
    }

    res.send(response);

}


export const Login = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const userRepository = getRepository(User);

    const user = await userRepository.findOne({email});
    if (!user) throw Error("User doesn't exist");

    const compareRst = await compare(password, user.password);
    if (!compareRst) {
        res.status(401).send({
            error: "Wrong password"
        })
        return;
    }

    const token = sign({id: user.id, nickname: user.nickname}, process.env.JWT_SECRET, {expiresIn: "60m"});

    const refresh_token = sign({id: user.id}, process.env.REFRESH_SECRET, {expiresIn: "7d"});

    res.cookie("jid", refresh_token, {httpOnly: true});

    res.status(200).send({token});
}


export const Register = async (req: Request, res: Response) => {
    const {nickname, email, password} = req.body;

    const userRepository = getRepository(User);
    const user = await userRepository.findOne({email});

    if (user) throw Error("User already exists");

    const salt = await genSalt(10);
    if (!salt) throw Error("Critical error");
    const hashedPassword = await hash(password, salt);
    if (!hashedPassword) throw Error("Critical error");

    const newUser = new User();
    newUser.email = email;
    newUser.nickname = nickname;
    newUser.password = hashedPassword;

    await userRepository.save(newUser);

    res.status(200).json({
        message: "User created successfully"
    });
}
