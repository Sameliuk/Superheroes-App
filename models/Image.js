const Sequelize = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define(
        'images',
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            superhero_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            url: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        },
        {
            tableName: 'images',
            timestamps: false,
        }
    );
};
