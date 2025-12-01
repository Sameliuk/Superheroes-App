import db from '../models/index.js';
import { Op, fn, col, where } from 'sequelize';

export class SequelizeSuperheroesRepository {
  async findAll({ page, limit, userId, searchQuery }) {
    const offset = (page - 1) * limit;
    const filters = {};

    if (userId !== undefined) {
      filters.user_id = userId;
    }

    if (searchQuery) {
      filters[Op.or] = [
        { nickname: { [Op.iLike]: `%${searchQuery}%` } },
        { real_name: { [Op.iLike]: `%${searchQuery}%` } },
      ];
    }

    const data = await db.Superheroes.findAll({
      where: filters,
      include: {
        model: db.Images,
        as: 'images',
        attributes: ['id', 'url'],
      },
      limit,
      offset,
    });

    const totalCount = await db.Superheroes.count({ where: filters });

    return { data, totalCount };
  }

  async findById(id) {
    return db.Superheroes.findByPk(id, {
      include: {
        model: db.Images,
        as: 'images',
        attributes: ['id', 'url'],
      },
    });
  }

  async findByNormalizedNickname(normalizedNickname) {
    return db.Superheroes.findOne({
      where: where(
        fn('LOWER', fn('REPLACE', col('nickname'), ' ', '')),
        normalizedNickname,
      ),
    });
  }

  async create(userId, data) {
    return db.Superheroes.create({
      ...data,
      user_id: userId,
    });
  }

  async update(userId, heroId, data) {
    const hero = await db.Superheroes.findOne({
      where: { id: heroId, user_id: userId },
    });

    if (!hero) return null;

    await hero.update(data);
    return hero;
  }

  async delete(userId, heroId) {
    const hero = await db.Superheroes.findOne({
      where: { id: heroId, user_id: userId },
    });

    if (!hero) return false;

    await hero.destroy();
    return true;
  }
}
