import express from 'express';
import { SignIn, Signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/signin', SignIn);

export default router;