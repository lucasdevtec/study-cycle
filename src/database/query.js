import pool from "./db.js";

export async function query(text, params = [], client = null) {
	const start = Date.now();

	try {
		const executor = client || pool;

		const duration = Date.now() - start;
		console.log("SQL:", text, `${duration}ms`);

		return await executor.query(text, params);
	} catch (err) {
		console.error("DB ERROR:", err);
		throw err;
	}
}
