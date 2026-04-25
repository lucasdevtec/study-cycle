import pool from "../src/database/db.js";
import { execSync } from "child_process";

async function run() {
	const client = await pool.connect();

	try {
		await client.query("BEGIN");

		await client.query(`
			DROP SCHEMA public CASCADE;
			CREATE SCHEMA public;
			SET search_path TO public;
		`);

		await client.query("COMMIT");

		console.log("🗑️ Banco limpo");

		// roda scripts como CLI (correto)
		execSync("node scripts/init-db.js", { stdio: "inherit" });
		execSync("node scripts/seed-db.js", { stdio: "inherit" });

		console.log("♻️ Banco resetado com sucesso");
		process.exit(0);
	} catch (err) {
		await client.query("ROLLBACK");
		console.error("❌ Erro no reset:", err);
		process.exit(1);
	} finally {
		client.release();
	}
}

run();
