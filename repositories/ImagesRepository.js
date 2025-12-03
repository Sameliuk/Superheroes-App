import db from '../models/index.js';

export class SequelizeImagesRepository {
  async createImages(superheroId, urls) {
    const records = urls.map((url) => ({
      superhero_id: superheroId,
      url,
    }));

    await db.Images.bulkCreate(records);
  }

  async removeImages(imageIds) {
    await db.Images.destroy({
      where: { id: imageIds },
    });
  }
}
