import express from 'express';
import { authMiddleware } from '../middleware/authorization';
import * as groupController from '../controllers/groupController';
import * as groupMiddleware from '../middleware/groupMiddleware';

const router = express.Router();

router.post('/create', authMiddleware, groupMiddleware.PrepareUsers, groupController.CreateGroup)
router.post('/me', authMiddleware, groupController.MyGroups)
router.put('/add', authMiddleware, groupController.AddToGroup)

export default router;