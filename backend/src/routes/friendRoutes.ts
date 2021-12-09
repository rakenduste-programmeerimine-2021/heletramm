import express from 'express';
import * as friendController from '../controllers/friendController';
import { authMiddleware } from '../middleware/authorization';
import validationMiddleware, { friendAddValidation } from '../middleware/validation';

const router = express.Router();

router.post('/add', [authMiddleware, ...friendAddValidation, validationMiddleware], friendController.AddFriend);
router.get('/me', authMiddleware, friendController.MyFriends);
router.get('/find', authMiddleware, friendController.Find);

export default router;