import { withTransaction } from "@/database/transaction";
import { cycleRepo } from "@/database/repositories/cycleRepo";
import { cycleSubjectRepo } from "@/database/repositories/cycleSubjectRepo";
import { userRepo } from "@/database/repositories/userRepo";
import { createCycleSchema, idSchema, updateSubjectHoursSchema } from "@/lib/modules/cycle/cycle.schema";
import { calculateCyclePlan } from "@/lib/cycle";

export const cycleService = {
	async createCycle(data, client) {
		const parsed = createCycleSchema.partial().parse(data);
		const { name, weeklyHours, userId, subjects } = parsed;

		const { totalPlannedHours, subjects: processedSubjects } = calculateCyclePlan({
			subjects,
			weeklyHours,
		});

		return withTransaction(async client => {
			const cycle = await cycleRepo.create(
				{
					name,
					weeklyHours,
					plannedHours: totalPlannedHours,
					userId,
				},
				client,
			);

			const savedSubjects = await cycleSubjectRepo.createMany(cycle.id, processedSubjects, client);

			return {
				...cycle,
				subjects: savedSubjects,
			};
		});
	},

	async getByUser(userId) {
		const parsedId = idSchema.parse(userId);

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
			if (!subjectsMap[subject.cycleId]) {
				subjectsMap[subject.cycleId] = [];
			}
			subjectsMap[subject.cycleId].push(subject);
		}

		return cycles.map(cycle => {
			const cycleSubjects = subjectsMap[cycle.id] || [];

			return {
				...cycle,
				// subjects: cycleSubjects,
				subjectsCount: cycleSubjects.length,
			};
		});
	},

	async addProgress(subjectId, additionalHours, userId) {
		const parsedSubjectId = idSchema.parse(subjectId);
		const parsedAdditionalHours = Number(additionalHours || 0);

		if (parsedAdditionalHours <= 0) {
			throw new Error("Horas adicionais inválidas");
		}

		const subject = await cycleSubjectRepo.findById(parsedSubjectId);
		if (!subject) throw new Error("Matéria não encontrada");

		const newTotal = subject.hoursDone + parsedAdditionalHours;

		const finalHours = newTotal > subject.recommendedHours ? subject.recommendedHours : newTotal;

		return await cycleSubjectRepo.updateProgress(parsedSubjectId, finalHours);
	},

	async updateCycle(cycleId, data) {
		const parsedId = idSchema.parse(cycleId);
		const parsed = createCycleSchema.partial().parse(data);

		return withTransaction(async client => {
			const existingCycle = await cycleRepo.findById(parsedId, client);

			if (!existingCycle) {
				throw new Error("Ciclo não encontrado");
			}

			if (parsed.userId && existingCycle.userId !== parsed.userId) {
				throw new Error("Acesso negado");
			}

			const nextName = parsed.name ?? existingCycle.name;
			const nextWeeklyHours = Number(parsed.weeklyHours ?? existingCycle.weeklyHours);
			const currentSubjects = await cycleSubjectRepo.findByCycle(parsedId, client);
			const nextSubjectsInput = parsed.subjects ?? currentSubjects;

			const { subjects: calculatedSubjects } = calculateCyclePlan({
				subjects: nextSubjectsInput,
				weeklyHours: nextWeeklyHours,
			});

			const updatedCycle = await cycleRepo.update(
				parsedId,
				{
					name: nextName,
					weeklyHours: nextWeeklyHours,
				},
				client,
			);

			await cycleSubjectRepo.deleteByCycle(parsedId, client);
			await cycleSubjectRepo.createMany(parsedId, calculatedSubjects, client);

			const subjects = await cycleSubjectRepo.findByCycle(parsedId, client);

			return {
				...updatedCycle,
				subjects,
			};
		});
	},

	async getFullCycle(cycleId, userId) {
		const parsedId = idSchema.parse(cycleId);
		const parsedUserId = idSchema.parse(userId);

		const cycle = await cycleRepo.findById(parsedId);

		if (!cycle) {
			throw new Error("Ciclo não encontrado");
		}

		if (cycle.userId !== parsedUserId) {
			throw new Error("Acesso negado");
		}

		const subjects = await cycleSubjectRepo.findByCycle(parsedId);

		return { ...cycle, subjects };
	},

	async deleteCycle(cycleId) {
		const parsedId = idSchema.parse(cycleId);

		return withTransaction(async client => {
			await cycleSubjectRepo.deleteByCycle(parsedId, client);
			await cycleRepo.delete(parsedId, client);
		});
	},

	async updateSubjectHours(cycleId, userId, payload) {
		const parsedCycleId = idSchema.parse(cycleId);
		const parsedUserId = idSchema.parse(userId);
		const { subjectId, hoursDone } = updateSubjectHoursSchema.parse(payload);

		return withTransaction(async client => {
			const cycle = await cycleRepo.findByIdForUpdate(parsedCycleId, client);

			if (!cycle) {
				throw new Error("Ciclo não encontrado");
			}

			if (cycle.userId !== parsedUserId) {
				throw new Error("Acesso negado");
			}

			const subject = await cycleSubjectRepo.findByIdForUpdate(subjectId, client);

			if (!subject || subject.cycleId !== parsedCycleId) {
				throw new Error("Matéria não encontrada");
			}

			const boundedHours = Math.max(0, Math.min(subject.recommendedHours, Number(hoursDone)));

			await cycleSubjectRepo.updateProgress(subjectId, boundedHours, client);

			const subjects = await cycleSubjectRepo.findByCycle(parsedCycleId, client);
			const atualCycleHours = subjects.reduce((acc, item) => acc + Number(item.hoursDone || 0), 0);
			const allSubjectsCompleted = subjects.every(item => Number(item.hoursDone || 0) >= Number(item.recommendedHours || 0));
			const cycleJustCompleted = allSubjectsCompleted && !cycle.cycleDone;

			let updatedCycle;

			if (cycleJustCompleted) {
				updatedCycle = await cycleRepo.markCycleCompleted(parsedCycleId, Number(cycle.plannedHours || 0), atualCycleHours, client);
				await userRepo.addCycleCompletion(parsedUserId, Number(cycle.plannedHours || 0), client);
			} else {
				updatedCycle = await cycleRepo.updateProgressSnapshot(
					parsedCycleId,
					{
						atualCycleHours,
						cycleDone: allSubjectsCompleted ? cycle.cycleDone : false,
					},
					client,
				);
			}

			return {
				cycle: updatedCycle,
				subjects,
				cycleJustCompleted,
				allSubjectsCompleted,
			};
		});
	},

	async restartCycle(cycleId, userId) {
		const parsedCycleId = idSchema.parse(cycleId);
		const parsedUserId = idSchema.parse(userId);

		return withTransaction(async client => {
			const cycle = await cycleRepo.findByIdForUpdate(parsedCycleId, client);

			if (!cycle) {
				throw new Error("Ciclo não encontrado");
			}

			if (cycle.userId !== parsedUserId) {
				throw new Error("Acesso negado");
			}

			await cycleSubjectRepo.resetProgressByCycle(parsedCycleId, client);

			const nextCycleDone = cycle.cycleDone ? false : cycle.cycleDone;
			const updatedCycle = await cycleRepo.restartProgress(parsedCycleId, nextCycleDone, client);
			const subjects = await cycleSubjectRepo.findByCycle(parsedCycleId, client);

			return {
				cycle: updatedCycle,
				subjects,
			};
		});
	},
};
