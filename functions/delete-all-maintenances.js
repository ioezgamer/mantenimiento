const { query } = require('./utils/db');

exports.handler = async (event, context) => {
  try {
    // Verificar que el método sea DELETE
    if (event.httpMethod !== 'DELETE') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Método no permitido' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // Verificar el token de seguridad
    const setupKey = process.env.SETUP_KEY;
    const authHeader = event.headers.authorization || '';
    const token = authHeader.split(' ')[1];

    if (!token || token !== setupKey) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'No autorizado' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // Eliminar todos los registros en Neon DB
    const result = await query('DELETE FROM maintenances RETURNING id');
    const deletedCount = result.rowCount;

    // Devolver respuesta exitosa
    return {
      statusCode: 200,
      body: JSON.stringify({ deleted: true, count: deletedCount }),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    console.error('Error al eliminar todos los mantenimientos:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al eliminar todos los mantenimientos', details: error.message }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};