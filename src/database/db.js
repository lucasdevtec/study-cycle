import "dotenv/config";
import pkg from "pg";

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL não definida");
}

const globalForPool = globalThis;

const pool =
	globalForPool.pool ||
	new Pool({
		connectionString: process.env.DATABASE_URL,
		ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
		connectionTimeoutMillis: 5000,
		idleTimeoutMillis: 10000,
	});
console.log("DB connected:", process.env.DATABASE_URL?.split("@")[1]);

if (process.env.NODE_ENV !== "production") {
	globalForPool.pool = pool;
}

export default pool;
