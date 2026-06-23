const pool = require("./database");

const testDatabaseConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log("Database Connected:", result.rows[0]);
  } catch (error) {
    console.error("Database Connection Failed", error);
  }
};

module.exports = testDatabaseConnection;
