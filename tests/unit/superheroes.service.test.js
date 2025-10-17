import { jest } from '@jest/globals';
import SuperheroesController from '../../controllers/SuperheroController.js';
import SuperheroesService from '../../services/SuperheroService.js';

// Мокаємо всі методи сервісу
SuperheroesService.getAllSuperheroes = jest.fn();
SuperheroesService.getSingleSuperhero = jest.fn();
SuperheroesService.createSuperhero = jest.fn();
SuperheroesService.updateSuperhero = jest.fn();
SuperheroesService.deleteSuperhero = jest.fn();

describe('SuperheroesController', () => {
  let req, res;

  beforeEach(() => {
    // Створюємо мок об'єкти req та res
    req = { query: { mine: 'true' }, params: {}, body: {}, user: { id: 1 } };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(), // важливо для res.status(...).json(...)
    };

    // Очищаємо попередні виклики моків
    jest.clearAllMocks();
  });

  test('getAllSuperheroes - success', async () => {
    const mockData = {
      page: 1,
      totalPages: 1,
      data: [{ id: 1, nickname: 'Batman' }],
    };
    SuperheroesService.getAllSuperheroes.mockResolvedValue(mockData);

    await SuperheroesController.getAllSuperheroes(req, res);

    expect(SuperheroesService.getAllSuperheroes).toHaveBeenCalledWith(
      1, // page
      5, // limit
      1, // userId з req.user.id
      '', // searchQuery
    );
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  test('getSingleSuperhero - not found', async () => {
    req.params.superheroId = 999;
    SuperheroesService.getSingleSuperhero.mockResolvedValue(null);

    await SuperheroesController.getSingleSuperhero(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Superhero not found' });
  });

  test('createSuperhero - success', async () => {
    const hero = { id: 2, nickname: 'Iron Man' };
    SuperheroesService.createSuperhero.mockResolvedValue(hero);

    await SuperheroesController.createSuperhero(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(hero);
  });

  test('updateSuperhero - not found', async () => {
    req.params.superheroId = 3;
    SuperheroesService.updateSuperhero.mockResolvedValue(null);

    await SuperheroesController.updateSuperhero(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Superhero not found or not yours',
    });
  });

  test('deleteSuperhero - not found', async () => {
    req.params.superheroId = 3;
    SuperheroesService.deleteSuperhero.mockResolvedValue(false);

    await SuperheroesController.deleteSuperhero(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Superhero not found' });
  });

  test('updateSuperhero - success', async () => {
    req.params.superheroId = 1;
    req.body = { nickname: 'Dark Knight', catch_phrase: 'I am the night' };
    const updatedHero = {
      id: 1,
      nickname: 'Dark Knight',
      catch_phrase: 'I am the night',
    };

    SuperheroesService.updateSuperhero.mockResolvedValue(updatedHero);

    await SuperheroesController.updateSuperhero(req, res);

    expect(SuperheroesService.updateSuperhero).toHaveBeenCalledWith(
      1, // superheroId
      1,
      req.body, // дані для оновлення
    );
    expect(res.json).toHaveBeenCalledWith(updatedHero);
  });

  test('deleteSuperhero - success', async () => {
    req.params.superheroId = 1;
    SuperheroesService.deleteSuperhero.mockResolvedValue(true);

    await SuperheroesController.deleteSuperhero(req, res);

    expect(SuperheroesService.deleteSuperhero).toHaveBeenCalledWith(
      1, // superheroId
      req.user.id,
    );
    expect(res.json).toHaveBeenCalledWith({
      message: 'Superhero deleted',
    });
  });

  test('getSingleSuperhero - success', async () => {
    req.params.superheroId = 1;
    const mockHero = { id: 1, nickname: 'Batman' };
    SuperheroesService.getSingleSuperhero.mockResolvedValue(mockHero);

    await SuperheroesController.getSingleSuperhero(req, res);

    expect(SuperheroesService.getSingleSuperhero).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockHero);
  });

  test('getAllSuperheroes - with search query', async () => {
    req.query = { page: '1', limit: '5', mine: 'true', name: 'batman' }; // <-- mine додано
    req.user = { id: 1 };

    const mockData = {
      page: 1,
      totalPages: 1,
      data: [{ id: 1, nickname: 'Batman' }],
    };
    SuperheroesService.getAllSuperheroes.mockResolvedValue(mockData);

    await SuperheroesController.getAllSuperheroes(req, res);

    expect(SuperheroesService.getAllSuperheroes).toHaveBeenCalledWith(
      1, // page
      5, // limit
      1, // userId
      'batman', // name
    );
    expect(res.json).toHaveBeenCalledWith(mockData);
  });
});
