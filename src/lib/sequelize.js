import { Sequelize } from "sequelize";

let sequelize;

export function getSequelize() {
  if (sequelize) {
    return sequelize;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL nao configurada.");
  }

  sequelize = new Sequelize(databaseUrl, {
    dialect: "postgres",
    logging: false,
  });

  return sequelize;
}
