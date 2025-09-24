const db = require('../models/index');
const { Superheroes, Images } = db;

class SuperheroesController {
    async getAllSuperheroes(req, res, returnData = false) {
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

            res.json({
                page,
                totalPages,
                data: superheroes,
            });
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

            const newHero = await Superheroes.create({
                nickname,
                real_name,
                origin_description,
                superpowers,
                catch_phrase,
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

            const superhero = await Superheroes.findByPk(superheroId, {
                include: { model: Images, as: 'images' },
            });

            if (!superhero) {
                return res.status(404).json({ error: 'Superhero not found' });
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

            const updatedSuperhero = await Superheroes.findByPk(superheroId, {
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
            if (isNaN(superheroId)) {
                return res.status(400).json({ error: 'Invalid superheroId' });
            }

            const superhero = await Superheroes.findByPk(superheroId);

            if (!superhero) {
                return res.status(404).json({ error: 'Superhero not found' });
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
}

module.exports = new SuperheroesController();
