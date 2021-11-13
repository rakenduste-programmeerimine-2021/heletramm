import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();


router.get('/users', authController.GetUsers);
router.post('/register', authController.Register);
router.post('/login', authController.Login);

export default router;