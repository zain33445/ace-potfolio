import express from 'express';
import { wpController } from '../controllers/wpController.js';

const router = express.Router();

router.get('/posts', wpController.getPosts);
router.get('/pages', wpController.getPages);

export default router;
