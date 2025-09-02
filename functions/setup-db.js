const { Client } = require("pg");

exports.handler = async (event, context) => {
  try {
    // Verificar método GET
    if (event.httpMethod !== "GET") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Método no permitido" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    // Verificar clave de seguridad
    const params = event.queryStringParameters;
    const setupKey = params && params.key;

    if (!setupKey || setupKey !== process.env.SETUP_KEY) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "No autorizado" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    // Conexión usando la URL completa de Neon
    const client = new Client({
      connectionString: process.env.NEON_DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // necesario para Neon
    });

    await client.connect();

    // Crear tabla si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS maintenances (
        id SERIAL PRIMARY KEY,
        equipo TEXT,
        usuario TEXT,
        fechaProximo DATE
      );
    `);

    // Crear índices
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_maintenances_equipo ON maintenances(equipo);"
    );
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_maintenances_usuario ON maintenances(usuario);"
    );
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_maintenances_fecha ON maintenances(fechaProximo);"
    );

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Base de datos inicializada correctamente",
      }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    console.error("Error al configurar la base de datos:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error al configurar la base de datos",
        details: error.message,
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
