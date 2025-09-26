import FavoriteService from '../services/FavoriteService.js';

class FavoriteController {
  async getFavorites(req, res) {
    try {
      const userId = req.user?.id || 1;
      const favorites = await FavoriteService.getFavoriteSuperheroes(userId);
      res.json(favorites);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async addFavorite(req, res) {
    try {
      const userId = req.user?.id || 1;
      const { superheroId } = req.body;
      const result = await FavoriteService.addToFavorites(userId, superheroId);
      if (!result)
        return res.status(404).json({ error: 'Superhero not found' });
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async removeFavorite(req, res) {
    try {
      const userId = req.user?.id || 1;
      const { superheroId } = req.params;
      const success = await FavoriteService.removeFromFavorites(
        userId,
        superheroId,
      );
      if (!success)
        return res.status(404).json({ error: 'Favorite not found' });
      res.json({ message: 'Removed from favorites' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default new FavoriteController();
