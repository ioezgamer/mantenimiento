const { query } = require('./utils/neon');

exports.handler = async (event, context) => {
  try {
    // Verificar que el método sea GET y que tenga una clave de seguridad
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Método no permitido' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // Verificar clave de seguridad
    const params = event.queryStringParameters;
    const setupKey = params && params.key;
    
    if (!setupKey || setupKey !== process.env.SETUP_KEY) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'No autorizado' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // Crear tabla de mantenimientos si no existe
    await query(`
      CREATE TABLE IF NOT EXISTS maintenances (
        id SERIAL PRIMARY KEY,
        equipo TEXT NOT NULL,
        tipo TEXT NOT NULL,
        fecha_mantenimiento DATE NOT NULL,
        descripcion TEXT,
        estado TEXT NOT NULL,
        usuario TEXT NOT NULL,
        proximo_mantenimiento DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Tabla maintenances creada o verificada');

    // Crear índices para búsquedas comunes
    await query('CREATE INDEX IF NOT EXISTS idx_maintenances_equipo ON maintenances(equipo)');
    console.log('Índice idx_maintenances_equipo creado o verificado');
    
    await query('CREATE INDEX IF NOT EXISTS idx_maintenances_usuario ON maintenances(usuario)');
    console.log('Índice idx_maintenances_usuario creado o verificado');
    
    await query('CREATE INDEX IF NOT EXISTS idx_maintenances_fecha_proximo ON maintenances(proximo_mantenimiento)');
    console.log('Índice idx_maintenances_fecha_proximo creado o verificado');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Base de datos inicializada correctamente' }),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    console.error('Error al configurar la base de datos:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al configurar la base de datos' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};