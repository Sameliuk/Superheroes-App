import express from 'express';
import superheroesRouter from './superheroes.js';
import superheroesController from '../controllers/SuperheroesController.js';

const router = express.Router();

router.use('/superheroes', superheroesRouter);
router.get('/', superheroesController.getAllSuperheroes);

export default router;
