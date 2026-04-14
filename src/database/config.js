require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL nao configurada.");
}

module.exports = {
  development: {
    url: databaseUrl,
    dialect: "postgres",
    logging: false,
  },
  production: {
    url: databaseUrl,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
