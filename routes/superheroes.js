import express from 'express';
import SuperheroesController from '../controllers/SuperheroController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get(
  '/',
  (req, res, next) => {
    if (req.query.mine === 'true') return authMiddleware(req, res, next);
    next();
  },
  SuperheroesController.getAllSuperheroes,
);

router.post('/', authMiddleware, SuperheroesController.createSuperhero);
router.get('/:superheroId', SuperheroesController.getSingleSuperhero);
router.put(
  '/:superheroId',
  authMiddleware,
  SuperheroesController.updateSuperhero,
);
router.delete(
  '/:superheroId',
  authMiddleware,
  SuperheroesController.deleteSuperhero,
);

export default router;
