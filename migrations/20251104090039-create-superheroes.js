'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('superheroes', {
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
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('superheroes');
}
