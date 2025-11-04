'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('favorites', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    superhero_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'superheroes',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
  });

  // Унікальний індекс, щоб один користувач не міг додати того ж героя двічі
  await queryInterface.addConstraint('favorites', {
    fields: ['user_id', 'superhero_id'],
    type: 'unique',
    name: 'unique_user_superhero',
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('favorites');
}
