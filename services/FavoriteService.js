import db from '../models/index.js';

const { Users, Superheroes, Images, Favorites } = db;

class FavoriteService {
  async getFavoriteSuperheroes(userId) {
    const user = await Users.findByPk(userId, {
      include: {
        model: Superheroes,
        as: 'favoriteSuperheroes',
        include: { model: Images, as: 'images', attributes: ['id', 'url'] },
      },
    });

    if (!user) return null;

    return { userId: user.id, favorites: user.favoriteSuperheroes || [] };
  }

  async addToFavorites(userId, superheroId) {
    const superhero = await Superheroes.findByPk(superheroId);
    if (!superhero) return null;

    const [favorite, created] = await Favorites.findOrCreate({
      where: { user_id: userId, superhero_id: superheroId },
    });

    return { favorite, created };
  }

  async removeFromFavorites(userId, superheroId) {
    const favorite = await Favorites.findOne({
      where: { user_id: userId, superhero_id: superheroId },
    });

    if (!favorite) return false;

    await favorite.destroy();
    return true;
  }
}

export default new FavoriteService();
