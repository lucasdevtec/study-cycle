"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert("users", [
      {
        id: 1,
        name: "Estudante Demo",
        email: "demo@studycycle.local",
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert("cycles", [
      {
        id: 1,
        name: "Ciclo ENEM - Maio",
        weekly_hours: 20,
        user_id: 1,
        created_at: now,
        updated_at: now,
      },
    ]);

    // Matematica pessimo (5x), Biologia neutro (3x), Quimica bom (2x)
    // somaPesos = 10, fator = 20/10 = 2
    // Matematica: ceil(2*5) = 10h, Biologia: ceil(2*3) = 6h, Quimica: ceil(2*2) = 4h
    await queryInterface.bulkInsert("cycle_subjects", [
      {
        cycle_id: 1,
        name: "Matematica",
        affinity_rank: 1,
        base_weight: 5,
        extra_weight: 0,
        final_weight: 5,
        recommended_hours: 10,
        created_at: now,
        updated_at: now,
      },
      {
        cycle_id: 1,
        name: "Biologia",
        affinity_rank: 3,
        base_weight: 3,
        extra_weight: 0,
        final_weight: 3,
        recommended_hours: 6,
        created_at: now,
        updated_at: now,
      },
      {
        cycle_id: 1,
        name: "Quimica",
        affinity_rank: 4,
        base_weight: 2,
        extra_weight: 0,
        final_weight: 2,
        recommended_hours: 4,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("cycle_subjects", { cycle_id: 1 });
    await queryInterface.bulkDelete("cycles", { id: 1 });
    await queryInterface.bulkDelete("users", { id: 1 });
  },
};
