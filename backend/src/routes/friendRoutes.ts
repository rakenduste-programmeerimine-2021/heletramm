import express from 'express';
import * as friendController from '../controllers/friendController';
import { authMiddleware } from '../middleware/authorization';

const router = express.Router();

router.post('/add', authMiddleware, friendController.AddFriend);
router.get('/me', authMiddleware, friendController.MyFriends);

export default router;