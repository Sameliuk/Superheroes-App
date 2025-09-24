const { Sequelize, DataTypes } = require('sequelize');
const SuperheroesModel = require('./Superhero');
const ImageModel = require('./Image');

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
Images.belongsTo(Superheroes, { foreignKey: 'superhero_id', as: 'superhero' });

const db = {
    sequelize,
    Sequelize,
    Superheroes,
    Images,
};

module.exports = db;
