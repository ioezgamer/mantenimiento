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

    // Obtener el ID del mantenimiento de los parámetros de la ruta
    const id = event.path.split('/').pop();
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'ID de mantenimiento no proporcionado' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // Verificar si el mantenimiento existe
    const checkResult = await query('SELECT id FROM maintenances WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Mantenimiento no encontrado' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // Eliminar el registro en Neon DB
    await query('DELETE FROM maintenances WHERE id = $1', [id]);

    // Devolver respuesta exitosa
    return {
      statusCode: 200,
      body: JSON.stringify({ id, deleted: true }),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    console.error('Error al eliminar mantenimiento:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al eliminar el mantenimiento', details: error.message }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};