import { SuperheroesService } from 'superheroes-service-lib';

import { SequelizeSuperheroesRepository } from '../repositories/SuperheroesRepository.js';

import { SequelizeImagesRepository } from '../repositories/ImagesRepository.js';

const superheroesService = new SuperheroesService(
  new SequelizeSuperheroesRepository(),
  new SequelizeImagesRepository(),
);

export default superheroesService;
