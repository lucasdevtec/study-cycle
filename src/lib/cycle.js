export const affinityOptions = [
	{ value: 1, label: "Péssimo (5x)" },
	{ value: 2, label: "Ruim (4x)" },
	{ value: 3, label: "Neutro (3x)" },
	{ value: 4, label: "Bom (2x)" },
	{ value: 5, label: "Ótimo (1x)" },
];

export function normalizeSubject(subject) {
	const affinity = Number(subject.affinityRank) || 3; // Default para Neutro caso venha vazio

	// A lógica de 6 - affinity substitui perfeitamente o AFFINITY_WEIGHT_MAP
	// Ex: 6 - 1 (Péssimo) = 5. 6 - 5 (Ótimo) = 1.
	const baseWeight = 6 - affinity;
	const extraWeight = Number(subject.extraWeight || 0);

	// Garante que o peso final nunca seja menor que 1, mesmo com pesos extras negativos
	const finalWeight = Math.max(1, baseWeight + extraWeight);

	return {
		...subject,
		affinityRank: affinity,
		baseWeight,
		extraWeight,
		finalWeight,
	};
}

export function calculateCyclePlan({ subjects, weeklyHours }) {
	const sanitizedHours = Math.max(0, Number(weeklyHours || 0));
	const parsedSubjects = subjects.map(normalizeSubject);
	const totalWeight = parsedSubjects.reduce((acc, item) => acc + item.finalWeight, 0);

	// Tratamento de segurança caso enviem 0 horas ou array vazio
	if (!totalWeight || !sanitizedHours) {
		return {
			factor: 0,
			totalWeight,
			totalPlannedHours: 0,
			subjects: parsedSubjects.map(item => ({
				...item,
				recommendedHours: 2, // Garante o mínimo de 2h mesmo sem horas distribuídas
			})),
		};
	}

	const factor = sanitizedHours / totalWeight;

	const plannedSubjects = parsedSubjects.map(item => {
		const proportionalHours = factor * item.finalWeight;

		return {
			...item,
			// Usando Math.ceil como no seu front para sempre arredondar as horas pra cima
			recommendedHours: Math.max(2, Math.ceil(proportionalHours)),
		};
	});

	const totalPlannedHours = plannedSubjects.reduce((acc, item) => acc + item.recommendedHours, 0);

	return {
		factor,
		totalWeight,
		totalPlannedHours,
		subjects: plannedSubjects,
	};
}
