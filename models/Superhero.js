const Sequelize = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define(
        'superheroes',
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            nickname: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            real_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            origin_description: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            superpowers: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            catch_phrase: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        },
        {
            tableName: 'superheroes',
            timestamps: false,
        }
    );
};
