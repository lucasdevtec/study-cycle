import test from "node:test";
import assert from "node:assert/strict";
import { normalizeSubject, calculateCyclePlan } from "../src/lib/cycle.js";

test("normalizeSubject calcula baseWeight inverso da afinidade", () => {
	// Afinidade 1 (Péssimo) deve gerar baseWeight 5
	const subject1 = normalizeSubject({ affinityRank: 1 });
	assert.equal(subject1.baseWeight, 5);
	assert.equal(subject1.finalWeight, 5);

	// Afinidade 5 (Ótimo) deve gerar baseWeight 1
	const subject5 = normalizeSubject({ affinityRank: 5 });
	assert.equal(subject5.baseWeight, 1);
	assert.equal(subject5.finalWeight, 1);

	// Afinidade 3 (Neutro) deve gerar baseWeight 3
	const subject3 = normalizeSubject({ affinityRank: 3 });
	assert.equal(subject3.baseWeight, 3);
	assert.equal(subject3.finalWeight, 3);
});

test("normalizeSubject soma peso extra e garante mínimo 1", () => {
	const subjectWithExtra = normalizeSubject({ affinityRank: 2, extraWeight: 3 });
	// baseWeight = 6 - 2 = 4; finalWeight = 4 + 3 = 7
	assert.equal(subjectWithExtra.baseWeight, 4);
	assert.equal(subjectWithExtra.extraWeight, 3);
	assert.equal(subjectWithExtra.finalWeight, 7);

	// Mesmo com peso extra negativo absurdo, garante no mínimo 1
	const subjectNegative = normalizeSubject({ affinityRank: 5, extraWeight: -10 });
	assert.equal(subjectNegative.finalWeight, 1);
});

test("calculateCyclePlan distribui horas proporcionalmente com mínimo de 2h", () => {
	const subjects = [
		{ id: "1", name: "Matemática", affinityRank: 1, extraWeight: 0 }, // weight 5
		{ id: "2", name: "Português", affinityRank: 5, extraWeight: 0 }, // weight 1
	];

	const plan = calculateCyclePlan({ subjects, weeklyHours: 20 });

	assert.equal(plan.totalWeight, 6);
	assert.ok(plan.factor > 0);
	assert.equal(plan.subjects.length, 2);

	// Matéria com maior peso deve receber mais horas
	const mat = plan.subjects.find(s => s.name === "Matemática");
	const port = plan.subjects.find(s => s.name === "Português");

	assert.ok(mat.recommendedHours > port.recommendedHours);
	// Ambas devem ter pelo menos 2h
	assert.ok(mat.recommendedHours >= 2);
	assert.ok(port.recommendedHours >= 2);
	assert.equal(plan.totalPlannedHours, mat.recommendedHours + port.recommendedHours);
});

test("calculateCyclePlan lida com zero horas ou lista vazia sem quebrar", () => {
	const emptyPlan = calculateCyclePlan({ subjects: [], weeklyHours: 10 });
	assert.equal(emptyPlan.totalPlannedHours, 0);
	assert.equal(emptyPlan.totalWeight, 0);

	const zeroHoursPlan = calculateCyclePlan({
		subjects: [{ id: "1", name: "Física", affinityRank: 3 }],
		weeklyHours: 0,
	});
	assert.equal(zeroHoursPlan.totalPlannedHours, 0);
	assert.equal(zeroHoursPlan.subjects[0].recommendedHours, 2);
});
