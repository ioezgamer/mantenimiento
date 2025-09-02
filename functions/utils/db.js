const { Pool } = require('pg');

// Configuración de la conexión a Neon DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necesario para conexiones SSL a Neon DB
  }
});

// Función para ejecutar consultas SQL
async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// Función para inicializar la base de datos
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
    console.log('Base de datos inicializada correctamente');
    return { success: true, message: 'Base de datos inicializada correctamente' };
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  query,
  setupDatabase
};