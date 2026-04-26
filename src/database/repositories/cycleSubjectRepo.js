import { query } from "@/database/query";

export const cycleSubjectRepo = {
	async createMany(cycleId, subjects, client) {
		const values = [];
		const params = [];

		subjects.forEach((s, i) => {
			const base = i * 7;

			values.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7})`);

			params.push(cycleId, s.name, s.affinityRank, s.baseWeight, s.extraWeight, s.finalWeight, s.recommendedHours);
		});

		await query(
			`INSERT INTO cycle_subjects
       (cycle_id, name, affinity_rank, base_weight, extra_weight, final_weight, recommended_hours)
       VALUES ${values.join(",")}`,
			params,
			client,
		);
	},

	async findByCycle(cycleId, client) {
		const { rows } = await query(`SELECT * FROM cycle_subjects WHERE cycle_id = $1 ORDER BY id`, [cycleId], client);
		return rows;
	},

	async deleteByCycle(cycleId, client) {
		await query(`DELETE FROM cycle_subjects WHERE cycle_id = $1`, [cycleId], client);
	},
};
