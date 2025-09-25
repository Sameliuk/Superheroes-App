import express from 'express';
import usersRouter from './users.js';
import superheroesRouter from './superheroes.js';
import superheroesController from '../controllers/SuperheroesController.js';

const router = express.Router();

router.use('/users', usersRouter);
router.use('/superheroes', superheroesRouter);
router.get('/', superheroesController.getAllSuperheroes);

export default router;
