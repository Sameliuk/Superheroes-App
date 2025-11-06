import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import SuperheroesModel from './Superhero.js';
import ImageModel from './Image.js';
import UsersModel from './User.js';
import FavoritesModel from './Favorites.js';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize
  .authenticate()
  .then(() => console.log('Connected!'))
  .catch((err) => console.error('Conection error:', err));

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

try {
  await sequelize.authenticate();
  console.log('Database connection established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:');
  console.error('Message:', error);
  console.error('Host:', process.env.DB_HOST);
  console.error('User:', process.env.DB_USER);
  console.error('DB:', process.env.DB_NAME);
}

export default db;
