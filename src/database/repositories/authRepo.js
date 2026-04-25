import pool from "@/database/db";

export async function findUserByEmail(email) {
	const { rows } = await pool.query("SELECT * FROM users WHERE email = $1 LIMIT 1", [email]);
	return rows[0] ?? null;
}

export async function createUser({ name, email, password }) {
	const { rows } = await pool.query(
		`INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email`,
		[name, email, password],
	);
	return rows[0];
}
