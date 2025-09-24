// routes/superheroes.js
import express from 'express';
import superheroesController from '../controllers/SuperheroesController.js';

const router = express.Router();

router.post('/create', superheroesController.createSuperhero);
router.get('/:superheroId', superheroesController.getSingleSuperhero);
router.put('/:superheroId', superheroesController.updateSuperhero);
router.delete('/:superheroId', superheroesController.deleteSuperhero);
router.get('/', superheroesController.getAllSuperheroes);

export default router;
