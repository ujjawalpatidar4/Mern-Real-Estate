import express from 'express';
import { SignIn, Signup , GoogleSignIn , SignoutUser} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/signin', SignIn);
router.post('/google', GoogleSignIn);
router.get('/signout', SignoutUser)


export default router;