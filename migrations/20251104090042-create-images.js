'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('images', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    superhero_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'superheroes',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('images');
}
