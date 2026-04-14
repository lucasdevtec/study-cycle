"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("cycle_subjects", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      cycle_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "cycles",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      affinity_rank: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      base_weight: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      extra_weight: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      final_weight: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      recommended_hours: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("cycle_subjects");
  },
};
