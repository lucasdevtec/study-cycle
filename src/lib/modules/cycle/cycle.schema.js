import { z } from "zod";

export const idSchema = z.coerce.number().int().positive();

export const subjectSchema = z.object({
	name: z.string().min(1),
	affinityRank: z.number().int().min(1).max(5),
	extraWeight: z.number().int().min(0).optional(),
});

export const createCycleSchema = z.object({
	name: z.string().min(1),
	weeklyHours: z.number().int().min(1),
	userId: z.number().int().positive(),
	subjects: z.array(subjectSchema).min(1),
});

export const updateSubjectHoursSchema = z.object({
	subjectId: idSchema,
	hoursDone: z.coerce.number().int().min(0),
});
