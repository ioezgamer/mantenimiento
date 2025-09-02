// Configuración de conexión a Neon DB (PostgreSQL)
require('dotenv').config();
const { Pool } = require('pg');

// Opciones de conexión desde variables de entorno
const connectionString = process.env.NEON_DATABASE_URL || null;

// Configuración del pool de conexiones
const pool = connectionString 
  ? new Pool({ connectionString }) 
  : new Pool({
      user: process.env.NEON_USER,
      password: process.env.NEON_PASSWORD,
      host: process.env.NEON_HOST,
      port: process.env.NEON_PORT || 5432,
      database: process.env.NEON_DATABASE,
      ssl: {
        rejectUnauthorized: false // Necesario para conexiones SSL a Neon
      }
    });

// Función para ejecutar consultas SQL
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Consulta ejecutada', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error en consulta', { text, error });
    throw error;
  }
}

module.exports = {
  query,
  pool
};