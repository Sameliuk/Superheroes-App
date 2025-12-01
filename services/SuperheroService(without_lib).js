import db from '../models/index.js';
import { Op } from 'sequelize';

const { Superheroes, Images } = db;

class SuperheroesService {
  async getAllSuperheroes(
    page = 1,
    limit = 5,
    userId = null,
    searchQuery = '',
  ) {
    const offset = (page - 1) * limit;

    const filters = {};

    if (userId) filters.user_id = userId;
    if (searchQuery) {
      filters[Op.or] = [
        { nickname: { [Op.iLike]: `%${searchQuery}%` } },
        { real_name: { [Op.iLike]: `%${searchQuery}%` } },
      ];
    }

    const superheroes = await Superheroes.findAll({
      where: filters,
      include: { model: Images, as: 'images', attributes: ['id', 'url'] },
      limit,
      offset,
    });

    const totalCount = await Superheroes.count({ where: filters });
    const totalPages = Math.ceil(totalCount / limit);

    return { page, totalPages, data: superheroes };
  }

  async createSuperhero(userId, heroData) {
    let {
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
      images,
    } = heroData;

    const normalizedNickname = nickname.replace(/\s+/g, '').toLowerCase();

    const existingHero = await Superheroes.findOne({
      where: {
        [Op.and]: [
          db.sequelize.where(
            db.sequelize.fn(
              'LOWER',
              db.sequelize.fn('REPLACE', db.sequelize.col('nickname'), ' ', ''),
            ),
            normalizedNickname,
          ),
        ],
      },
    });

    if (existingHero) {
      throw new Error('A superhero with this nickname already exists');
    }

    const newHero = await Superheroes.create({
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
      user_id: userId,
    });

    if (Array.isArray(images) && images.length > 0) {
      const imageRecords = images.map((url) => ({
        superhero_id: newHero.id,
        url,
      }));
      await Images.bulkCreate(imageRecords);
    }

    return Superheroes.findByPk(newHero.id, {
      include: { model: Images, as: 'images' },
    });
  }

  async getSingleSuperhero(superheroId) {
    return Superheroes.findByPk(superheroId, {
      include: { model: Images, as: 'images', attributes: ['id', 'url'] },
    });
  }

  async updateSuperhero(userId, superheroId, heroData) {
    const {
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
      newImages = [],
      removeImageIds = [],
    } = heroData;

    const superhero = await Superheroes.findOne({
      where: { id: superheroId, user_id: userId },
      include: { model: Images, as: 'images' },
    });

    if (!superhero) return null;

    await superhero.update({
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
    });

    if (removeImageIds.length > 0) {
      await Images.destroy({
        where: { id: removeImageIds, superhero_id: superheroId },
      });
    }

    if (newImages.length > 0) {
      const imagesToCreate = newImages.map((url) => ({
        superhero_id: superheroId,
        url,
      }));
      await Images.bulkCreate(imagesToCreate);
    }

    return Superheroes.findOne({
      where: { id: superheroId, user_id: userId },
      include: { model: Images, as: 'images', attributes: ['id', 'url'] },
    });
  }

  async deleteSuperhero(userId, superheroId) {
    const superhero = await Superheroes.findOne({
      where: { id: superheroId, user_id: userId },
    });

    if (!superhero) return false;

    await superhero.destroy();
    return true;
  }
}

export default new SuperheroesService();
