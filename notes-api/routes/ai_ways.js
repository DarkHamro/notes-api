import express from 'express';
import { askAI } from '../src/ai.js';

const router = express.Router();

router.post('/', askAI);

export default router;