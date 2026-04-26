import { withTransaction } from "@/database/transaction";
import { cycleRepo } from "@/database/repositories/cycleRepo";
import { cycleSubjectRepo } from "@/database/repositories/cycleSubjectRepo";
import { createCycleSchema, cycleIdSchema } from "@/lib/modules/cycle/cycle.schema";

export const cycleService = {
	async createCycle(data) {
		const parsed = createCycleSchema.parse(data);

		return withTransaction(async client => {
			const cycle = await cycleRepo.create(
				{
					name: parsed.name,
					weeklyHours: parsed.weeklyHours,
					userId: parsed.userId,
				},
				client,
			);

			const subjects = this._calc(parsed.subjects, parsed.weeklyHours);

			await cycleSubjectRepo.createMany(cycle.id, subjects, client);

			return { ...cycle, subjects };
		});
	},

	async getByUser(userId) {
		const parsedId = cycleIdSchema.parse(userId);

		const cycles = await cycleRepo.findByUser(parsedId);

		if (!cycles.length) {
			return [];
		}

		const cycleIds = cycles.map(c => c.id);

		const subjects = [];
		for (const cycleId of cycleIds) {
			const cycleSubjects = await cycleSubjectRepo.findByCycle(cycleId);
			subjects.push(...cycleSubjects);
		}

		const subjectsMap = {};

		for (const subject of subjects) {
			if (!subjectsMap[subject.cycle_id]) {
				subjectsMap[subject.cycle_id] = [];
			}
			subjectsMap[subject.cycle_id].push(subject);
		}

		return cycles.map(cycle => {
			const cycleSubjects = subjectsMap[cycle.id] || [];

			return {
				...cycle,
				subjects: cycleSubjects,
				subjectsCount: cycleSubjects.length,
				plannedHours: cycleSubjects.reduce((sum, s) => sum + s.recommended_hours, 0),
			};
		});
	},

	async getFullCycle(cycleId, userId) {
		const parsedId = cycleIdSchema.parse(cycleId);

		const cycle = await cycleRepo.findById(parsedId);

		if (!cycle) {
			throw new Error("Ciclo não encontrado");
		}

		if (cycle.userId !== userId) {
			throw new Error("Acesso negado");
		}

		const subjects = await cycleSubjectRepo.findByCycle(parsedId);

		return { ...cycle, subjects };
	},

	async deleteCycle(cycleId) {
		const parsedId = cycleIdSchema.parse(cycleId);

		return withTransaction(async client => {
			await cycleSubjectRepo.deleteByCycle(parsedId, client);
			await cycleRepo.delete(parsedId, client);
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
