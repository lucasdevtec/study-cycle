import { NextResponse } from "next/server";
import { calculateCyclePlan } from "@/lib/cycle";
import { ensureUser, getDbModels } from "@/lib/db";

function getUserIdFromRequest(request) {
  const userIdParam = request.nextUrl.searchParams.get("userId");
  const parsed = Number(userIdParam || 1);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return 1;
  }

  return parsed;
}

export async function GET(request) {
  try {
    const userId = getUserIdFromRequest(request);
    await ensureUser(userId);
    const { Cycle, CycleSubject } = await getDbModels();

    const cycles = await Cycle.findAll({
      where: { userId },
      include: [{ model: CycleSubject, as: "subjects" }],
      order: [["id", "DESC"]],
    });

    return NextResponse.json({
      userId,
      cycles: cycles.map((cycle) => {
        const raw = cycle.toJSON();
        return {
          ...raw,
          subjectsCount: raw.subjects.length,
          plannedHours: raw.subjects.reduce(
            (sum, subject) => sum + subject.recommendedHours,
            0,
          ),
        };
      }),
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao listar ciclos.", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const userId = Number(body.userId || 1);
    const name = String(body.name || "").trim();
    const weeklyHours = Number(body.weeklyHours || 0);
    const subjectsInput = Array.isArray(body.subjects) ? body.subjects : [];

    if (!name) {
      return NextResponse.json(
        { message: "Nome do ciclo é obrigatório." },
        { status: 400 },
      );
    }

    if (!subjectsInput.length) {
      return NextResponse.json(
        { message: "Informe ao menos uma matéria." },
        { status: 400 },
      );
    }

    const subjects = subjectsInput
      .map((subject) => ({
        name: String(subject.name || "").trim(),
        affinityRank: Number(subject.affinityRank || 3),
        extraWeight: Number(subject.extraWeight || 0),
      }))
      .filter((subject) => subject.name);

    if (!subjects.length) {
      return NextResponse.json(
        { message: "Todas as matérias estão sem nome." },
        { status: 400 },
      );
    }

    const plan = calculateCyclePlan({ subjects, weeklyHours });
    await ensureUser(userId);

    const { sequelize, Cycle, CycleSubject } = await getDbModels();
    const result = await sequelize.transaction(async (transaction) => {
      const cycle = await Cycle.create(
        {
          userId,
          name,
          weeklyHours,
        },
        { transaction },
      );

      await CycleSubject.bulkCreate(
        plan.subjects.map((subject) => ({
          cycleId: cycle.id,
          name: subject.name,
          affinityRank: subject.affinityRank,
          baseWeight: subject.baseWeight,
          extraWeight: subject.extraWeight,
          finalWeight: subject.finalWeight,
          recommendedHours: subject.recommendedHours,
        })),
        { transaction },
      );

      return cycle;
    });

    return NextResponse.json({
      id: result.id,
      message: "Ciclo criado com sucesso.",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao criar ciclo.", details: error.message },
      { status: 500 },
    );
  }
}
