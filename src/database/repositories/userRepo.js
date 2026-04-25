import { query } from "@/database/query";
import bcrypt from "bcryptjs";

export const userRepo = {
	async create({ name, email, password }) {
		const hashed = await bcrypt.hash(password, 10);

		const { rows } = await query(
			`INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
			[name, email, hashed],
		);

		return rows[0];
	},

	async findByEmail(email) {
		const { rows } = await query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [email]);

		return rows[0] || null;
	},

	async findById(id) {
		const { rows } = await query(`SELECT id, name, email FROM users WHERE id = $1`, [id]);

		return rows[0] || null;
	},
};
