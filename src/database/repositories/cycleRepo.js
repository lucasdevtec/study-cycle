import { query } from "@/database/query";

export const cycleRepo = {
	async create({ name, weeklyHours, userId }) {
		const { rows } = await query(
			`INSERT INTO cycles (name, weekly_hours, user_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
			[name, weeklyHours, userId],
		);

		return rows[0];
	},

	async findByUser(userId) {
		const { rows } = await query(`SELECT * FROM cycles WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);

		return rows;
	},

	async findById(id) {
		const { rows } = await query(`SELECT * FROM cycles WHERE id = $1`, [id]);

		return rows[0] || null;
	},
};
