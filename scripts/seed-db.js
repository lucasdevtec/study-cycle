import fs from "fs";
import path from "path";
import pool from "../src/database/db.js";

async function run() {
	const client = await pool.connect();

	try {
		const sql = fs.readFileSync(path.join(process.cwd(), "src/database/seed.sql"), "utf-8");

		await client.query("BEGIN");

		const statements = sql
			.split(";")
			.map(s => s.trim())
			.filter(Boolean);

		for (const stmt of statements) {
			await client.query(stmt);
		}

		await client.query("COMMIT");

		console.log("🌱 Seed executado com sucesso");
		process.exit(0);
	} catch (err) {
		await client.query("ROLLBACK");
		console.error("❌ Erro no seed:", err);
		process.exit(1);
	} finally {
		client.release();
	}
}

run();
