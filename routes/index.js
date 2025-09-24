const express = require('express');
const superheroesRouter = require('./superheroes');
const superheroesController = require('../controllers/SuperheroesController');

const router = express.Router();

router.use('/superheroes', superheroesRouter);
router.get('/', superheroesController.getAllSuperheroes);

module.exports = router;
