import { defineCycleModel } from "@/models/Cycle";
import { defineCycleSubjectModel } from "@/models/CycleSubject";
import { defineUserModel } from "@/models/User";
import { getSequelize } from "@/lib/sequelize";

let initialized = false;
let models;

export async function getDbModels() {
  if (initialized && models) {
    return models;
  }

  const sequelize = getSequelize();

  const User = defineUserModel(sequelize);
  const Cycle = defineCycleModel(sequelize);
  const CycleSubject = defineCycleSubjectModel(sequelize);

  User.hasMany(Cycle, { foreignKey: "userId", as: "cycles" });
  Cycle.belongsTo(User, { foreignKey: "userId", as: "user" });

  Cycle.hasMany(CycleSubject, {
    foreignKey: "cycleId",
    as: "subjects",
    onDelete: "CASCADE",
    hooks: true,
  });
  CycleSubject.belongsTo(Cycle, { foreignKey: "cycleId", as: "cycle" });

  await sequelize.authenticate();
  await sequelize.sync();

  initialized = true;
  models = { sequelize, User, Cycle, CycleSubject };

  return models;
}

export async function ensureUser(userId) {
  const { User } = await getDbModels();
  const parsedUserId = Number(userId || 1);

  const [user] = await User.findOrCreate({
    where: { id: parsedUserId },
    defaults: {
      id: parsedUserId,
      name: `Usuario ${parsedUserId}`,
      email: `usuario${parsedUserId}@studycycle.local`,
    },
  });

  return user;
}
