import { DataTypes } from 'sequelize';

export default function (sequelize) {
  return sequelize.define(
    'favorites',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      superhero_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'superheroes',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    },
    {
      tableName: 'favorites',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'superhero_id'],
        },
      ],
    },
  );
}
