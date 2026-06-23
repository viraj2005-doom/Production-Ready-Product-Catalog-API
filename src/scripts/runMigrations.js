const fs = require("fs");
const path = require("path");
const pool = require("../config/database");

async function runMigrations() {
  try {
    const migrationsDir = path.join(__dirname, "../../migrations");

    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");

      console.log(`Running ${file}`);

      await pool.query(sql);
    }

    console.log("All migrations executed.");

    process.exit(0);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

runMigrations();
