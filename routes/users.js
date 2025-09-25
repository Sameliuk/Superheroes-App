import express from 'express';
import userController from '../controllers/UsersController.js';

const router = express.Router();

router.post('/signIn', userController.signInHandler);
router.post('/signUp', userController.signUpHandler);
router.get('/logout', userController.logOutHandler);

export default router;
