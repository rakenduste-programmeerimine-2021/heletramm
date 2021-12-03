import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';
import { authMiddleware } from '../middleware/authorization';
import validationMiddleware from '../middleware/validation';
import { registerValidation, loginValidation } from '../middleware/validation';

const router = express.Router();


router.get('/users', authMiddleware, authController.GetUsers);
router.post('/register', registerValidation, validationMiddleware,
authController.Register);
router.post('/login', loginValidation, authController.Login);
router.get('/refresh_token', authController.RefreshToken);
router.get('/logout', authController.Logout);

export default router;