import express from 'express'
import * as chatMiddleware from '../middleware/chatMiddleware';
import * as chatController from '../controllers/chatController'

const router = express.Router();

router.get('/connect', chatMiddleware.InitChat, chatController.initChatConnection);

export default router;