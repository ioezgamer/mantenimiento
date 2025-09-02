const { q, client } = require('./utils/fauna');

exports.handler = async (event, context) => {
  try {
    // Obtener el ID del mantenimiento de los parámetros de la ruta
    const id = event.path.split('/').pop();
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'ID de mantenimiento no proporcionado' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // Consultar el mantenimiento en FaunaDB
    const result = await client.query(
      q.Get(q.Ref(q.Collection('maintenances'), id))
    );

    // Devolver el mantenimiento encontrado
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: result.ref.id,
        ...result.data
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    console.error('Error al obtener mantenimiento:', error);
    
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
      body: JSON.stringify({ error: 'Error al obtener el mantenimiento' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};