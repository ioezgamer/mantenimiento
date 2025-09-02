const { query, setupDatabase } = require('./utils/db');

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

    // Inicializar la base de datos usando la función setupDatabase
    const setupResult = await setupDatabase();
    
    if (!setupResult.success) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error al inicializar la base de datos', details: setupResult.error }),
        headers: { 'Content-Type': 'application/json' }
      };
    }
    
    // Crear índices para búsquedas comunes
    await query('CREATE INDEX IF NOT EXISTS idx_maintenances_equipo ON maintenances(equipo)');
    console.log('Índice idx_maintenances_equipo creado o verificado');
    
    await query('CREATE INDEX IF NOT EXISTS idx_maintenances_usuario ON maintenances(usuario)');
    console.log('Índice idx_maintenances_usuario creado o verificado');
    
    await query('CREATE INDEX IF NOT EXISTS idx_maintenances_fecha ON maintenances(fechaProximo)');
    console.log('Índice idx_maintenances_fecha creado o verificado');

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