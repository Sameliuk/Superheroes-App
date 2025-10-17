import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import SuperheroesModel from './Superhero.js';
import ImageModel from './Image.js';
import UsersModel from './User.js';
import FavoritesModel from './Favorites.js';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    logging: false,
  },
);

const Users = UsersModel(sequelize);
const Superheroes = SuperheroesModel(sequelize);
const Images = ImageModel(sequelize);
const Favorites = FavoritesModel(sequelize);

Users.hasMany(Superheroes, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  as: 'superheroes',
});

Superheroes.belongsTo(Users, {
  foreignKey: 'user_id',
  as: 'user',
});

Superheroes.hasMany(Images, {
  foreignKey: 'superhero_id',
  onDelete: 'CASCADE',
  as: 'images',
});

Images.belongsTo(Superheroes, {
  foreignKey: 'superhero_id',
  as: 'superhero',
});

Users.belongsToMany(Superheroes, {
  through: Favorites,
  foreignKey: 'user_id',
  otherKey: 'superhero_id',
  as: 'favoriteSuperheroes',
});

Superheroes.belongsToMany(Users, {
  through: Favorites,
  foreignKey: 'superhero_id',
  otherKey: 'user_id',
  as: 'fans',
});

const db = {
  sequelize,
  Sequelize,
  Users,
  Superheroes,
  Images,
  Favorites,
};

export default db;
