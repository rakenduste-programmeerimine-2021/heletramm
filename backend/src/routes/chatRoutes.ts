import express from 'express'
import * as chatMiddleware from '../middleware/chatMiddleware';
import * as chatController from '../controllers/chatController'
import {authMiddleware} from '../middleware/authorization';

const router = express.Router();

router.post('/connect', [authMiddleware, chatMiddleware.InitChat], chatController.initChatConnection);
router.post('/history', [authMiddleware], chatController.chatHistory);

export default router;