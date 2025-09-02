// functions/utils/db.js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return { rows: result.rows }; // Cambia para devolver solo { rows }
  } finally {
    client.release();
  }
}

async function setupDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS maintenances (
      id SERIAL PRIMARY KEY,
      equipo TEXT NOT NULL,
      usuario TEXT NOT NULL,
      tipo TEXT NOT NULL,
      fechaMantenimiento DATE NOT NULL,
      descripcion TEXT,
      estado TEXT NOT NULL,
      fechaProximo DATE,
      notas TEXT
    );
  `;

  try {
    await query(createTableQuery);
    console.log("Base de datos inicializada correctamente");
    return {
      success: true,
      message: "Base de datos inicializada correctamente",
    };
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    return { success: false, error: error.message };
  }
}

module.exports = { query, setupDatabase };
