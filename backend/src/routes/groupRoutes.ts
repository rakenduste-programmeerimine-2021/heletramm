import express from 'express';
import { authMiddleware } from '../middleware/authorization';
import * as groupController from '../controllers/groupController';

const router = express.Router();

router.post('/create', authMiddleware, groupController.CreateGroup)
router.get('/me', authMiddleware, groupController.MyGroups)
router.put('/add', authMiddleware, groupController.AddToGroup)