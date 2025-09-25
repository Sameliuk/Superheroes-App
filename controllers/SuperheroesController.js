import db from '../models/index.js';
import { Op } from 'sequelize';
const { Users, Superheroes, Images, Favorites } = db;

class SuperheroesController {
  async getAllSuperheroes(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 5;
      const offset = (page - 1) * limit;

      const superheroes = await Superheroes.findAll({
        include: {
          model: Images,
          as: 'images',
          attributes: ['id', 'url'],
        },
        limit,
        offset,
      });

      const totalCount = await Superheroes.count();
      const totalPages = Math.ceil(totalCount / limit);

      res.json({ page, totalPages, data: superheroes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // 3. Улюблені супергерої користувача
  async getFavoriteSuperheroes(req, res) {
    try {
      const userId = req.session?.userId || parseInt(req.query.userId);
      if (!userId) return res.status(400).json({ error: 'userId is required' });

      const user = await Users.findByPk(userId, {
        include: {
          model: Superheroes,
          as: 'favoriteSuperheroes',
          include: { model: Images, as: 'images', attributes: ['id', 'url'] },
        },
      });

      if (!user) return res.status(404).json({ error: 'User not found' });

      res
        .status(200)
        .json({ userId: user.id, favorites: user.favoriteSuperheroes || [] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // 4. Пошук супергероїв користувача
  async searchSuperheroes(req, res) {
    try {
      const { query } = req.query;
      if (!query)
        return res.status(400).json({ error: 'Search query is required' });

      const superheroes = await Superheroes.findAll({
        where: {
          [Op.or]: [
            { nickname: { [Op.iLike]: `%${query}%` } },
            { real_name: { [Op.iLike]: `%${query}%` } },
          ],
        },
        include: { model: Images, as: 'images', attributes: ['id', 'url'] },
      });

      res.status(200).json(superheroes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async createSuperhero(req, res) {
    try {
      const {
        nickname,
        real_name,
        origin_description,
        superpowers,
        catch_phrase,
        images,
      } = req.body;

      const userId = req.session?.userId || parseInt(req.body.userId);

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
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

      const heroWithImages = await Superheroes.findByPk(newHero.id, {
        include: { model: Images, as: 'images' },
      });

      res.status(201).json(heroWithImages);
    } catch (error) {
      console.error('Error creating superhero:', error);
      res.status(500).json({
        error: 'Server error',
        details: error.message,
      });
    }
  }

  async getSingleSuperhero(req, res) {
    try {
      const superheroId = parseInt(req.params.superheroId);

      if (isNaN(superheroId)) {
        return res.status(400).json({ error: 'Invalid superhero ID' });
      }

      const superhero = await Superheroes.findByPk(superheroId, {
        include: {
          model: Images,
          as: 'images',
          attributes: ['id', 'url'],
        },
      });

      if (!superhero) {
        return res.status(404).json({ error: 'Superhero not found' });
      }

      res.status(200).json(superhero);
    } catch (error) {
      console.error('Error fetching superhero:', error);
      res.status(500).json({
        error: 'Server error',
        details: error.message,
      });
    }
  }

  async updateSuperhero(req, res) {
    try {
      const superheroId = parseInt(req.params.superheroId);
      const userId = req.session?.userId; // <-- тут беремо з сесії

      const {
        nickname,
        real_name,
        origin_description,
        superpowers,
        catch_phrase,
        newImages = [],
        removeImageIds = [],
      } = req.body;

      if (isNaN(superheroId)) {
        return res.status(400).json({ error: 'Invalid superhero ID' });
      }

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const superhero = await Superheroes.findOne({
        where: { id: superheroId, user_id: userId },
        include: { model: Images, as: 'images' },
      });

      if (!superhero) {
        return res
          .status(404)
          .json({ error: 'Superhero not found or not yours' });
      }

      await superhero.update({
        nickname,
        real_name,
        origin_description,
        superpowers,
        catch_phrase,
      });

      if (removeImageIds.length > 0) {
        await Images.destroy({
          where: {
            id: removeImageIds,
            superhero_id: superheroId,
          },
        });
      }

      if (newImages.length > 0) {
        const imagesToCreate = newImages.map((url) => ({
          superhero_id: superheroId,
          url,
        }));
        await Images.bulkCreate(imagesToCreate);
      }

      const updatedSuperhero = await Superheroes.findOne({
        where: { id: superheroId, user_id: userId },
        include: {
          model: Images,
          as: 'images',
          attributes: ['id', 'url'],
        },
      });

      res.status(200).json(updatedSuperhero);
    } catch (error) {
      console.error('Error updating superhero:', error);
      res.status(500).json({
        error: 'Server error',
        details: error.message,
      });
    }
  }

  async deleteSuperhero(req, res) {
    try {
      const superheroId = parseInt(req.params.superheroId);
      const userId = req.session?.userId;

      if (isNaN(superheroId)) {
        return res.status(400).json({ error: 'Invalid superheroId' });
      }

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const superhero = await Superheroes.findOne({
        where: { id: superheroId, user_id: userId },
      });

      if (!superhero) {
        return res
          .status(404)
          .json({ error: 'Superhero not found or not yours' });
      }

      await superhero.destroy();

      return res
        .status(200)
        .json({ message: 'Superhero deleted successfully' });
    } catch (error) {
      console.error('Error:', error);
      return res
        .status(500)
        .json({ error: 'Internal server error during deletion' });
    }
  }

  async addToFavorites(req, res) {
    try {
      const userId = req.session?.userId || parseInt(req.body.userId);
      const { superheroId } = req.body;

      if (!userId || !superheroId) {
        return res
          .status(400)
          .json({ error: 'userId and superheroId are required' });
      }

      const superhero = await db.Superheroes.findByPk(superheroId);
      if (!superhero) {
        return res.status(404).json({ error: 'Superhero not found' });
      }

      const [favorite, created] = await Favorites.findOrCreate({
        where: { user_id: userId, superhero_id: superheroId },
      });

      if (!created) {
        return res
          .status(200)
          .json({ message: 'Superhero is already in favorites' });
      }

      res
        .status(201)
        .json({ message: 'Superhero added to favorites', favorite });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

export default new SuperheroesController();
