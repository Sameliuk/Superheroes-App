import { jest } from '@jest/globals';

const mockFindAll = jest.fn();
const mockCount = jest.fn();
const mockFindOne = jest.fn();
const mockFindByPk = jest.fn();
const mockCreate = jest.fn();
const mockBulkCreate = jest.fn();
const mockDestroy = jest.fn();

jest.unstable_mockModule('../../models/index.js', () => ({
  __esModule: true,
  default: {
    sequelize: { where: jest.fn(), fn: jest.fn(), col: jest.fn() },
    Superheroes: {
      findAll: mockFindAll,
      count: mockCount,
      findOne: mockFindOne,
      findByPk: mockFindByPk,
      create: mockCreate,
    },
    Images: {
      bulkCreate: mockBulkCreate,
      destroy: mockDestroy,
    },
  },
}));

const { default: SuperheroesService } = await import(
  '../../services/SuperheroService.js'
);

describe('SuperheroesService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('getAllSuperheroes', () => {
    it('повертає героїв з пагінацією', async () => {
      mockFindAll.mockResolvedValue([{ id: 1, nickname: 'Batman' }]);
      mockCount.mockResolvedValue(10);

      const result = await SuperheroesService.getAllSuperheroes(1, 5);

      expect(mockFindAll).toHaveBeenCalled();
      expect(result.totalPages).toBe(2);
      expect(result.data[0].nickname).toBe('Batman');
    });
  });

  describe('createSuperhero', () => {
    it('створює нового героя, якщо такого ще немає', async () => {
      mockFindOne.mockResolvedValue(null);
      mockCreate.mockResolvedValue({ id: 1 });
      mockBulkCreate.mockResolvedValue([]);
      mockFindByPk.mockResolvedValue({
        id: 1,
        nickname: 'Spider Man',
        real_name: 'Peter Parker',
        images: [{ id: 1, url: 'img1' }],
      });

      const heroData = {
        nickname: 'Spider Man',
        real_name: 'Peter Parker',
        origin_description: 'Bitten by a radioactive spider',
        superpowers: 'Agility, web-slinging',
        catch_phrase: 'With great power...',
        images: ['img1'],
      };

      const result = await SuperheroesService.createSuperhero(1, heroData);

      expect(mockFindOne).toHaveBeenCalled();
      expect(mockCreate).toHaveBeenCalled();
      expect(mockBulkCreate).toHaveBeenCalledWith([
        { superhero_id: 1, url: 'img1' },
      ]);
      expect(result.nickname).toBe('Spider Man');
    });

    it('викидає помилку, якщо герой уже існує', async () => {
      mockFindOne.mockResolvedValue({ id: 10 });
      await expect(
        SuperheroesService.createSuperhero(1, { nickname: 'Spider Man' }),
      ).rejects.toThrow('A superhero with this nickname already exists');
    });
  });

  describe('getSingleSuperhero', () => {
    it('повертає героя за ID', async () => {
      const hero = { id: 2, nickname: 'Iron Man' };
      mockFindByPk.mockResolvedValue(hero);

      const result = await SuperheroesService.getSingleSuperhero(2);

      expect(mockFindByPk).toHaveBeenCalledWith(2, expect.any(Object));
      expect(result).toEqual(hero);
    });
  });

  describe('updateSuperhero', () => {
    it('оновлює героя, додає та видаляє зображення', async () => {
      const mockHero = { id: 1, update: jest.fn() };
      mockFindOne.mockResolvedValueOnce(mockHero);
      mockDestroy.mockResolvedValue();
      mockBulkCreate.mockResolvedValue();
      mockFindOne.mockResolvedValueOnce({
        id: 1,
        nickname: 'Updated Hero',
        images: [{ id: 10, url: 'new1' }],
      });

      const data = {
        nickname: 'Updated Hero',
        newImages: ['new1'],
        removeImageIds: [5],
      };
      const result = await SuperheroesService.updateSuperhero(1, 1, data);

      expect(mockHero.update).toHaveBeenCalled();
      expect(mockDestroy).toHaveBeenCalledWith({
        where: { id: [5], superhero_id: 1 },
      });
      expect(mockBulkCreate).toHaveBeenCalledWith([
        { superhero_id: 1, url: 'new1' },
      ]);
      expect(result.nickname).toBe('Updated Hero');
    });

    it('повертає null, якщо герой не знайдений', async () => {
      mockFindOne.mockResolvedValue(null);
      const result = await SuperheroesService.updateSuperhero(1, 99, {});
      expect(result).toBeNull();
    });
  });

  describe('deleteSuperhero', () => {
    it('видаляє героя, якщо знайдений', async () => {
      const mockHero = { destroy: jest.fn() };
      mockFindOne.mockResolvedValue(mockHero);
      const result = await SuperheroesService.deleteSuperhero(1, 2);
      expect(mockHero.destroy).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('повертає false, якщо герой не знайдений', async () => {
      mockFindOne.mockResolvedValue(null);
      const result = await SuperheroesService.deleteSuperhero(1, 999);
      expect(result).toBe(false);
    });
  });
});
