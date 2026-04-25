import { query } from "@/database/query";

export const cycleSubjectRepo = {
	async createMany(cycleId, subjects) {
		const values = [];
		const params = [];

		subjects.forEach((s, i) => {
			const baseIndex = i * 7;

			values.push(
				`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7})`,
			);

			params.push(cycleId, s.name, s.affinityRank, s.baseWeight, s.extraWeight, s.finalWeight, s.recommendedHours);
		});

		await query(
			`INSERT INTO cycle_subjects
       (cycle_id, name, affinity_rank, base_weight, extra_weight, final_weight, recommended_hours)
       VALUES ${values.join(",")}`,
			params,
		);
	},

	async findByCycle(cycleId) {
		const { rows } = await query(`SELECT * FROM cycle_subjects WHERE cycle_id = $1`, [cycleId]);

		return rows;
	},
};
