import pool from "./db.js";

export async function query(text, params = [], client = null) {
	try {
		const executor = client || pool;
		const start = Date.now();
		const result = await executor.query(text, params);
		const duration = Date.now() - start;
		if (process.env.NODE_ENV !== "production") console.log("SQL:", text, `${duration}ms`);
		return result;
	} catch (err) {
		console.error("DB ERROR:", err);
		throw err;
	}
}
