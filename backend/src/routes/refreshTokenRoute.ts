import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { TokenUser } from "../middleware/authorization";

interface RefreshTokenResponse {
    success: boolean,
    token?: string
}

export const refreshTokenRoute = (req: Request, res: Response) => {
    try {
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


    } catch (err) {

    }
}