const AFFINITY_WEIGHT_MAP = {
  1: 5,
  2: 4,
  3: 3,
  4: 2,
  5: 1,
};

export function normalizeSubject(subject) {
  const affinity = Number(subject.affinityRank);
  const baseWeight = AFFINITY_WEIGHT_MAP[affinity] ?? 3;
  const extraWeight = Number(subject.extraWeight || 0);
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
  const totalWeight = parsedSubjects.reduce(
    (acc, item) => acc + item.finalWeight,
    0,
  );

  if (!totalWeight || !sanitizedHours) {
    return {
      factor: 0,
      totalWeight,
      totalPlannedHours: 0,
      subjects: parsedSubjects.map((item) => ({
        ...item,
        recommendedHours: 2,
      })),
    };
  }

  const factor = sanitizedHours / totalWeight;
  const plannedSubjects = parsedSubjects.map((item) => {
    const proportionalHours = factor * item.finalWeight;

    return {
      ...item,
      recommendedHours: Math.max(2, Math.ceil(proportionalHours)),
    };
  });

  const totalPlannedHours = plannedSubjects.reduce(
    (acc, item) => acc + item.recommendedHours,
    0,
  );

  return {
    factor,
    totalWeight,
    totalPlannedHours,
    subjects: plannedSubjects,
  };
}

export const affinityOptions = [
  { value: 1, label: "Pessimo (5x)" },
  { value: 2, label: "Ruim (4x)" },
  { value: 3, label: "Neutro (3x)" },
  { value: 4, label: "Bom (2x)" },
  { value: 5, label: "Otimo (1x)" },
];
