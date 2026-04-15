import { DataTypes } from "sequelize";

export function defineCycleModel(sequelize) {
  return sequelize.define(
    "Cycle",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      weeklyHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "cycles",
      underscored: true,
    },
  );
}
