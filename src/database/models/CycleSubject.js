import { DataTypes } from "sequelize";

export function defineCycleSubjectModel(sequelize) {
  return sequelize.define(
    "CycleSubject",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      cycleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      affinityRank: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      baseWeight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      extraWeight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      finalWeight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      recommendedHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "cycle_subjects",
      underscored: true,
    },
  );
}
