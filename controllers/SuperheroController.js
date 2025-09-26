import SuperheroesService from '../services/SuperheroService.js';

class SuperheroController {
  async getAllSuperheroes(req, res) {
    try {
      const { page = 1, limit = 5, mine, name } = req.query;
      let userId = null;

      if (mine === 'true') {
        if (!req.user) {
          return res
            .status(401)
            .json({ error: 'Unauthorized: user not found' });
        }
        userId = req.user.id;
      }

      const result = await SuperheroesService.getAllSuperheroes(
        +page,
        +limit,
        userId,
        name || '',
      );

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getSingleSuperhero(req, res) {
    try {
      const hero = await SuperheroesService.getSingleSuperhero(
        req.params.superheroId,
      );
      if (!hero) return res.status(404).json({ error: 'Superhero not found' });
      res.json(hero);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createSuperhero(req, res) {
    try {
      const userId = req.user?.id || 1; // тимчасово, доки не підключена автентифікація
      const hero = await SuperheroesService.createSuperhero(userId, req.body);
      res.status(201).json(hero);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateSuperhero(req, res) {
    try {
      const userId = req.user?.id || 1;
      const hero = await SuperheroesService.updateSuperhero(
        userId,
        req.params.superheroId,
        req.body,
      );
      if (!hero)
        return res
          .status(404)
          .json({ error: 'Superhero not found or not yours' });
      res.json(hero);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteSuperhero(req, res) {
    try {
      const userId = req.user?.id || 1;
      const success = await SuperheroesService.deleteSuperhero(
        userId,
        req.params.superheroId,
      );
      if (!success)
        return res.status(404).json({ error: 'Superhero not found' });
      res.json({ message: 'Superhero deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchSuperheroes(req, res) {
    try {
      const heroes = await SuperheroesService.searchSuperheroes(req.query.q);
      res.json(heroes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default new SuperheroController();
