import { query } from "@/database/query";

export const cycleRepo = {
	async create({ name, weeklyHours, userId }, client) {
		const rows = await query(
			`INSERT INTO cycles (name, weekly_hours, user_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
			[name, weeklyHours, userId],
			client,
		);

		return rows[0];
	},

	async findByUser(userId, client) {
		return query(`SELECT * FROM cycles WHERE user_id = $1 ORDER BY created_at DESC`, [userId], client);
	},

	async findById(id, client) {
		const rows = await query(`SELECT * FROM cycles WHERE id = $1`, [id], client);

		return rows[0] || null;
	},

	async delete(id, client) {
		await query(`DELETE FROM cycles WHERE id = $1`, [id], client);
	},
};
