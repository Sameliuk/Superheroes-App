import express from 'express';
import usersRouter from './users.js';
import superheroesRouter from './superheroes.js';

const router = express.Router();

router.use('/users', usersRouter);
router.use('/superheroes', superheroesRouter);

export default router;
