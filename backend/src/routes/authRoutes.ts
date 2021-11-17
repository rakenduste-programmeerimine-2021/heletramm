import express from 'express';
import * as authController from '../controllers/authController';
import { authMiddleware } from '../middleware/authorization';

const router = express.Router();


router.get('/users', authMiddleware, authController.GetUsers);
router.post('/register', authController.Register);
router.post('/login', authController.Login);
router.get('/refresh_token', authController.RefreshToken);

export default router;