import { NextResponse } from "next/server";
import { calculateCyclePlan } from "@/lib/cycle";
import { getDbModels } from "@/lib/db";

async function parseId(rawParams) {
  const params = await rawParams;
  const id = Number(params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function findCycle(cycleId) {
  const { Cycle, CycleSubject } = await getDbModels();
  const cycle = await Cycle.findByPk(cycleId, {
    include: [{ model: CycleSubject, as: "subjects" }],
  });

  return cycle;
}

export async function GET(_request, { params }) {
  try {
    const cycleId = await parseId(params);

    if (!cycleId) {
      return NextResponse.json({ message: "ID inválido." }, { status: 400 });
    }

    const cycle = await findCycle(cycleId);

    if (!cycle) {
      return NextResponse.json(
        { message: "Ciclo não encontrado." },
        { status: 404 },
      );
    }

    return NextResponse.json(cycle.toJSON());
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar ciclo.", details: error.message },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const cycleId = await parseId(params);

    if (!cycleId) {
      return NextResponse.json({ message: "ID inválido." }, { status: 400 });
    }

    const body = await request.json();
    const name = String(body.name || "").trim();
    const weeklyHours = Number(body.weeklyHours || 0);
    const subjectsInput = Array.isArray(body.subjects) ? body.subjects : null;

    if (!name) {
      return NextResponse.json(
        { message: "Nome do ciclo é obrigatório." },
        { status: 400 },
      );
    }

    const { sequelize, Cycle, CycleSubject } = await getDbModels();
    const cycle = await Cycle.findByPk(cycleId);

    if (!cycle) {
      return NextResponse.json(
        { message: "Ciclo não encontrado." },
        { status: 404 },
      );
    }

    await sequelize.transaction(async (transaction) => {
      cycle.name = name;

      if (Number.isFinite(weeklyHours) && weeklyHours > 0) {
        cycle.weeklyHours = weeklyHours;
      }

      await cycle.save({ transaction });

      if (subjectsInput) {
        const subjects = subjectsInput
          .map((subject) => ({
            name: String(subject.name || "").trim(),
            affinityRank: Number(subject.affinityRank || 3),
            extraWeight: Number(subject.extraWeight || 0),
          }))
          .filter((subject) => subject.name);

        if (!subjects.length) {
          throw new Error("Informe ao menos uma matéria válida.");
        }

        const plan = calculateCyclePlan({
          subjects,
          weeklyHours: cycle.weeklyHours,
        });

        await CycleSubject.destroy({
          where: { cycleId: cycle.id },
          transaction,
        });

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
      }
    });

    return NextResponse.json({ message: "Ciclo atualizado com sucesso." });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao atualizar ciclo.", details: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const cycleId = await parseId(params);

    if (!cycleId) {
      return NextResponse.json({ message: "ID inválido." }, { status: 400 });
    }

    const { Cycle } = await getDbModels();
    const cycle = await Cycle.findByPk(cycleId);

    if (!cycle) {
      return NextResponse.json(
        { message: "Ciclo não encontrado." },
        { status: 404 },
      );
    }

    await cycle.destroy();

    return NextResponse.json({ message: "Ciclo removido com sucesso." });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao remover ciclo.", details: error.message },
      { status: 500 },
    );
  }
}
