import test from "node:test";
import assert from "node:assert/strict";
import { snakeToCamel } from "../src/utils/snakeToCamelCase.js";
import { formatZodError } from "../src/utils/zodErrors.js";
import { z } from "zod";

test("snakeToCamel converte chaves snake_case para camelCase", () => {
	const input = {
		user_id: 1,
		total_hours_done: 20,
		cycle_done: true,
	};

	const output = snakeToCamel(input);
	assert.deepEqual(output, {
		userId: 1,
		totalHoursDone: 20,
		cycleDone: true,
	});
});

test("snakeToCamel lida com arrays de objetos", () => {
	const input = [
		{ subject_id: 10, recommended_hours: 4 },
		{ subject_id: 11, recommended_hours: 6 },
	];

	const output = snakeToCamel(input);
	assert.deepEqual(output, [
		{ subjectId: 10, recommendedHours: 4 },
		{ subjectId: 11, recommendedHours: 6 },
	]);
});

test("formatZodError extrai mapeamento campo -> mensagem de erro", () => {
	const schema = z.object({
		name: z.string().min(1, "Nome obrigatório"),
		email: z.string().email("Email inválido"),
	});

	const result = schema.safeParse({ name: "", email: "not-an-email" });
	assert.equal(result.success, false);

	if (!result.success) {
		const formatted = formatZodError(result.error);
		assert.equal(formatted.name, "Nome obrigatório");
		assert.equal(formatted.email, "Email inválido");
	}
});
