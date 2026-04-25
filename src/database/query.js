import pool from "./db.js";

export async function query(text, params = []) {
	const start = Date.now();

	try {
		const res = await pool.query(text, params);

		const duration = Date.now() - start;
		console.log("SQL:", text, params, `${duration}ms`);

		return res;
	} catch (err) {
		console.error("DB ERROR:", err);
		throw err;
	}
}
