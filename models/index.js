import { Sequelize } from 'sequelize';
import SuperheroesModel from './Superhero.js';
import ImageModel from './Image.js';

const sequelize = new Sequelize('test_task', 'postgres', '120306', {
  dialect: 'postgres',
  host: 'localhost',
});

const Superheroes = SuperheroesModel(sequelize);
const Images = ImageModel(sequelize);

Superheroes.hasMany(Images, {
  foreignKey: 'superhero_id',
  onDelete: 'CASCADE',
  as: 'images',
});

Images.belongsTo(Superheroes, {
  foreignKey: 'superhero_id',
  as: 'superhero',
});

const db = {
  sequelize,
  Sequelize,
  Superheroes,
  Images,
};

export default db;
