const express = require('express');
const superheroesController = require('../controllers/SuperheroesController');

const router = express.Router();

router.post('/create', superheroesController.createSuperhero);
router.get('/:superheroId', superheroesController.getSingleSuperhero);
router.put('/:superheroId', superheroesController.updateSuperhero);
router.delete('/:superheroId', superheroesController.deleteSuperhero);

module.exports = router;
