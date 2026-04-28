import { query } from "@/database/query";
import { snakeToCamel } from "@/utils/snakeToCamelCase";

export const cycleSubjectRepo = {
	async createMany(cycleId, subjects, client) {
		const values = [];
		const params = [];

		subjects.forEach((s, i) => {
			const base = i * 7;

			values.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7})`);

			params.push(cycleId, s.name, s.affinityRank, s.baseWeight, s.extraWeight, s.finalWeight, s.recommendedHours);
		});

		const { rows } = await query(
			`INSERT INTO cycle_subjects
       (cycle_id, name, affinity_rank, base_weight, extra_weight, final_weight, recommended_hours)
       VALUES ${values.join(",")}`,
			params,
			client,
		);
		return snakeToCamel(rows);
	},

	async updateProgress(subjectId, hours, client) {
		const { rows } = await query(
			`UPDATE cycle_subjects 
       SET hours_done = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
			[hours, subjectId],
			client,
		);
		return rows[0] ? snakeToCamel(rows[0]) : null;
	},

	async findById(subjectId, client) {
		const { rows } = await query(`SELECT * FROM cycle_subjects WHERE id = $1`, [subjectId], client);
		return rows[0] ? snakeToCamel(rows[0]) : null;
	},

	async findByIdForUpdate(subjectId, client) {
		const { rows } = await query(`SELECT * FROM cycle_subjects WHERE id = $1 FOR UPDATE`, [subjectId], client);
		return rows[0] ? snakeToCamel(rows[0]) : null;
	},

	async findByCycle(cycleId, client) {
		const { rows } = await query(`SELECT * FROM cycle_subjects WHERE cycle_id = $1 ORDER BY id`, [cycleId], client);

		return snakeToCamel(rows);
	},

	async deleteByCycle(cycleId, client) {
		await query(`DELETE FROM cycle_subjects WHERE cycle_id = $1`, [cycleId], client);
		return true;
	},

	async resetProgressByCycle(cycleId, client) {
		await query(
			`UPDATE cycle_subjects
       SET hours_done = 0,
           updated_at = NOW()
       WHERE cycle_id = $1`,
			[cycleId],
			client,
		);

		return true;
	},
};
