const { q, client } = require('./utils/fauna');

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

    // Eliminar el registro en FaunaDB
    await client.query(
      q.Delete(
        q.Ref(q.Collection('maintenances'), id)
      )
    );

    // Devolver respuesta exitosa
    return {
      statusCode: 200,
      body: JSON.stringify({ id, deleted: true }),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    console.error('Error al eliminar mantenimiento:', error);
    
    // Verificar si el error es porque el documento no existe
    if (error.name === 'NotFound') {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Mantenimiento no encontrado' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al eliminar el mantenimiento' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};