import { query } from "@/database/query";
import { snakeToCamel } from "@/utils/snakeToCamelCase";

export const cycleRepo = {
	async create({ name, weeklyHours, userId, plannedHours }, client) {
		const { rows } = await query(
			`INSERT INTO cycles (name, weekly_hours, user_id, planned_hours)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
			[name, weeklyHours, userId, plannedHours],
			client,
		);

		return snakeToCamel(rows[0]);
	},

	async findByUser(userId, client) {
		const { rows } = await query(`SELECT * FROM cycles WHERE user_id = $1 ORDER BY created_at DESC`, [userId], client);

		return snakeToCamel(rows);
	},

	async findById(id, client) {
		const { rows } = await query(`SELECT * FROM cycles WHERE id = $1`, [id], client);
		return rows[0] ? snakeToCamel(rows[0]) : null;
	},

	async findByIdForUpdate(id, client) {
		const { rows } = await query(`SELECT * FROM cycles WHERE id = $1 FOR UPDATE`, [id], client);
		return rows[0] ? snakeToCamel(rows[0]) : null;
	},

	async update(id, { name, weeklyHours }, client) {
		const { rows } = await query(
			`UPDATE cycles
       SET name = $1,
           weekly_hours = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
			[name, weeklyHours, id],
			client,
		);

		return rows[0] ? snakeToCamel(rows[0]) : null;
	},

	async delete(id, client) {
		await query(`DELETE FROM cycles WHERE id = $1`, [id], client);
		return true;
	},

	async updateProgressSnapshot(id, { atualCycleHours, cycleDone }, client) {
		const { rows } = await query(
			`UPDATE cycles
       SET atual_cycle_hours = $1,
           cycle_done = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
			[atualCycleHours, cycleDone, id],
			client,
		);

		return rows[0] ? snakeToCamel(rows[0]) : null;
	},

	async markCycleCompleted(id, plannedHours, atualCycleHours, client) {
		const { rows } = await query(
			`UPDATE cycles
       SET total_cycle_done = total_cycle_done + 1,
           total_hours_done = total_hours_done + $1,
           atual_cycle_hours = $2,
           cycle_done = true,
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
			[plannedHours, atualCycleHours, id],
			client,
		);

		return rows[0] ? snakeToCamel(rows[0]) : null;
	},

	async restartProgress(id, cycleDone, client) {
		const { rows } = await query(
			`UPDATE cycles
       SET atual_cycle_hours = 0,
           cycle_done = $1,
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
			[cycleDone, id],
			client,
		);

		return rows[0] ? snakeToCamel(rows[0]) : null;
	},
};
