import express from 'express';
import superheroesController from '../controllers/SuperheroesController.js';

const router = express.Router();

router.post('/', superheroesController.createSuperhero);
router.get('/search', superheroesController.searchSuperheroes);
router.get('/:superheroId', superheroesController.getSingleSuperhero);
router.put('/:superheroId', superheroesController.updateSuperhero);
router.delete('/:superheroId', superheroesController.deleteSuperhero);
router.post('/favorites', superheroesController.addToFavorites);
router.get('/favorites', superheroesController.getFavoriteSuperheroes);
router.get('/', superheroesController.getAllSuperheroes);

export default router;
