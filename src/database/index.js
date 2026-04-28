import { userRepo } from "@/repositories/userRepo";
import { cycleRepo } from "@/repositories/cycleRepo";
import { cycleSubjectRepo } from "@/repositories/cycleSubjectRepo";

const db = {
	user: userRepo,
	cycle: cycleRepo,
	cycleSubject: cycleSubjectRepo,
};

export default db;
