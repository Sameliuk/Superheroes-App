import { jest } from '@jest/globals';

// --- Моки методів SuperheroesRepository ---
const mockFindAll = jest.fn();
const mockFindById = jest.fn();
const mockFindByNormalizedNickname = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

// --- Моки методів ImagesRepository ---
const mockCreateImages = jest.fn();
const mockRemoveImages = jest.fn();

let superheroesService;

beforeAll(async () => {
  // --- Мокаємо класи репозиторіїв ---
  await jest.unstable_mockModule(
    '../../repositories/SuperheroesRepository.js',
    () => ({
      __esModule: true,
      SequelizeSuperheroesRepository: class {
        findAll = mockFindAll;
        findById = mockFindById;
        findByNormalizedNickname = mockFindByNormalizedNickname;
        create = mockCreate;
        update = mockUpdate;
        delete = mockDelete;
      },
    }),
  );

  await jest.unstable_mockModule(
    '../../repositories/ImagesRepository.js',
    () => ({
      __esModule: true,
      SequelizeImagesRepository: class {
        createImages = mockCreateImages;
        removeImages = mockRemoveImages;
      },
    }),
  );

  // --- Імпортуємо сервіс після моків ---
  const module = await import('../../services/SuperheroService');
  superheroesService = module.default;
});

afterEach(() => jest.clearAllMocks());

describe('SuperheroeService', () => {
  describe('getAllSuperheroes', () => {
    it('повертає героїв з пагінацією', async () => {
      mockFindAll.mockResolvedValue({
        data: [{ nickname: 'Batman' }],
        totalCount: 10,
      });

      const result = await superheroesService.getAllSuperheroes(1, 5);

      expect(mockFindAll).toHaveBeenCalled();
      expect(result.totalPages).toBe(2);
      expect(result.data[0].nickname).toBe('Batman');
    });
  });

  describe('createSuperhero', () => {
    it('створює нового героя, якщо такого ще немає', async () => {
      mockFindByNormalizedNickname.mockResolvedValue(null);
      mockCreate.mockResolvedValue({ id: 1 });
      mockFindById.mockResolvedValue({ id: 1, nickname: 'Spider Man' });

      const heroData = {
        nickname: 'Spider Man',
        real_name: 'Peter Parker',
        origin_description: 'Bitten by a radioactive spider',
        superpowers: 'Agility, web-slinging',
        catch_phrase: 'With great power...',
        images: ['img1'],
      };

      const result = await superheroesService.createSuperhero(1, heroData);

      expect(mockFindByNormalizedNickname).toHaveBeenCalled();
      expect(mockCreate).toHaveBeenCalledWith(1, heroData);
      expect(mockCreateImages).toHaveBeenCalledWith(1, ['img1']);
      expect(result.nickname).toBe('Spider Man');
    });

    it('викидає помилку, якщо герой уже існує', async () => {
      mockFindByNormalizedNickname.mockResolvedValue({ id: 10 });

      await expect(
        superheroesService.createSuperhero(1, { nickname: 'Spider Man' }),
      ).rejects.toThrow('A superhero with this nickname already exists');
    });
  });

  describe('getSingleSuperhero', () => {
    it('повертає героя за ID', async () => {
      const hero = { id: 2, nickname: 'Iron Man' };
      mockFindById.mockResolvedValue(hero);

      const result = await superheroesService.getSingleSuperhero(2);

      expect(mockFindById).toHaveBeenCalledWith(2);
      expect(result).toEqual(hero);
    });
  });

  describe('updateSuperhero', () => {
    it('оновлює героя, додає та видаляє зображення', async () => {
      mockUpdate.mockResolvedValue({ id: 1, nickname: 'Updated Hero' });
      mockFindById.mockResolvedValue({ id: 1, nickname: 'Updated Hero' });

      const data = {
        nickname: 'Updated Hero',
        newImages: ['new1'],
        removeImageIds: [5],
      };

      const result = await superheroesService.updateSuperhero(1, 1, data);

      expect(mockUpdate).toHaveBeenCalledWith(
        1,
        1,
        expect.objectContaining({
          nickname: 'Updated Hero',
        }),
      );
      expect(mockRemoveImages).toHaveBeenCalledWith([5]);
      expect(mockCreateImages).toHaveBeenCalledWith(1, ['new1']);
      expect(result.nickname).toBe('Updated Hero');
    });

    it('повертає null, якщо герой не знайдений', async () => {
      mockUpdate.mockResolvedValue(null);

      const result = await superheroesService.updateSuperhero(1, 99, {});

      expect(result).toBeNull();
    });
  });

  describe('deleteSuperhero', () => {
    it('видаляє героя, якщо знайдений', async () => {
      mockDelete.mockResolvedValue(true);

      const result = await superheroesService.deleteSuperhero(1, 2);

      expect(mockDelete).toHaveBeenCalledWith(1, 2);
      expect(result).toBe(true);
    });

    it('повертає false, якщо герой не знайдений', async () => {
      mockDelete.mockResolvedValue(false);

      const result = await superheroesService.deleteSuperhero(1, 999);

      expect(result).toBe(false);
    });
  });
});
