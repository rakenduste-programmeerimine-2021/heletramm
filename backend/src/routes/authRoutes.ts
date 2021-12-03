import express from 'express';
import * as authController from '../controllers/authController';
import { authMiddleware } from '../middleware/authorization';
import {body} from 'express-validator';
import { getConnection} from 'typeorm';
import validationMiddleware from '../middleware/validation';
import { User } from '../model/User';

const router = express.Router();


router.get('/users', authMiddleware, authController.GetUsers);
router.post('/register', [
    body('nickname')
        .isLength({min: 3})
        .withMessage("Nickname must be atleast 3 characters")
        .custom(async (nickname: string) => {
            const userRepository = getConnection().getRepository(User);
            const user = await userRepository.findOne({nickname});
            if (user) throw new Error("Nickname already exists");
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
],
validationMiddleware,
authController.Register);

router.post('/login', [
    body('email')
        .isEmail()
        .normalizeEmail()
        .custom(async (email: string) => {
            const userRepository = getConnection().getRepository(User);
            const user = await userRepository.findOne({email});

            if (!user) throw new Error("User doesn't exist");
        })
], authController.Login);

router.get('/refresh_token', authController.RefreshToken);
router.get('/logout', authMiddleware, authController.Logout);

export default router;