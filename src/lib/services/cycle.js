import { withTransaction } from "@/database/transaction";
import { cycleRepo } from "@/repositories/cycleRepo";
import { cycleSubjectRepo } from "@/repositories/cycleSubjectRepo";

export const cycleService = {
	async createCycle({ name, weeklyHours, userId, subjects }) {
		return withTransaction(async client => {
			const cycle = await cycleRepo.create({ name, weeklyHours, userId }, client);

			const calculated = this._calc(subjects, weeklyHours);

			await cycleSubjectRepo.createMany(cycle.id, calculated, client);

			return { ...cycle, subjects: calculated };
		});
	},

	async getByUser(userId) {
		return cycleRepo.findByUser(userId);
	},

	async getFullCycle(cycleId) {
		const cycle = await cycleRepo.findById(cycleId);

		if (!cycle) throw new Error("Ciclo não encontrado");

		const subjects = await cycleSubjectRepo.findByCycle(cycleId);

		return { ...cycle, subjects };
	},

	async deleteCycle(cycleId) {
		return withTransaction(async client => {
			await cycleSubjectRepo.deleteByCycle(cycleId, client);
			await cycleRepo.delete(cycleId, client);
		});
	},

	_calc(subjects, weeklyHours) {
		const total = subjects.reduce((sum, s) => sum + s.baseWeight + (s.extraWeight || 0), 0);

		const factor = weeklyHours / total;

		return subjects.map(s => {
			const finalWeight = s.baseWeight + (s.extraWeight || 0);

			return {
				name: s.name,
				affinityRank: s.affinityRank,
				baseWeight: s.baseWeight,
				extraWeight: s.extraWeight || 0,
				finalWeight,
				recommendedHours: Math.ceil(finalWeight * factor),
			};
		});
	},
};
