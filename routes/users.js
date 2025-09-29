import express from 'express';
import userController from '../controllers/UserController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import favoritesController from '../controllers/FavoritesController.js';

const router = express.Router();

router.post('/signUp', userController.signUp.bind(userController));
router.post('/signIn', userController.signIn.bind(userController));
router.post(
  '/logOut',
  authMiddleware,
  userController.logOut.bind(userController),
);

router.get('/favorites', authMiddleware, favoritesController.getFavorites);
router.post('/favorites', authMiddleware, favoritesController.addFavorite);
router.delete(
  '/favorites/:superheroId',
  authMiddleware,
  favoritesController.removeFavorite,
);

export default router;
