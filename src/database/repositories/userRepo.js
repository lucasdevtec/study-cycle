import { query } from "@/database/query";
import bcrypt from "bcryptjs";

export const userRepo = {
	async create({ name, email, password, provider, provider_id }, client) {
		let hashed = null;

		if (password) {
			hashed = await bcrypt.hash(password, 10);
		}

		const { rows } = await query(
			`INSERT INTO users (name, email, password, provider, provider_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
			[name, email, hashed, provider || null, provider_id || null],
			client,
		);

		return rows[0];
	},

	async findByEmail(email, client) {
		const { rows } = await query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [email], client);
		console.log(rows);
		return rows[0] || null;
	},

	async findById(id, client) {
		const { rows } = await query(`SELECT * FROM users WHERE id = $1`, [id], client);

		return rows[0] || null;
	},

	async findAll(client) {
		return query(`SELECT id, name, email FROM users`, [], client);
	},
};
