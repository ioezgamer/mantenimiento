const { q, client } = require('./utils/fauna');

exports.handler = async (event, context) => {
  try {
    // Verificar que el método sea PUT
    if (event.httpMethod !== 'PUT') {
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

    // Obtener los datos del cuerpo de la solicitud
    const data = JSON.parse(event.body);

    // Validar datos requeridos
    if (!data.equipo || !data.usuario || !data.fechaActual || !data.fechaProximo || !data.realizadoPor) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan campos requeridos' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // Actualizar el registro en FaunaDB
    const result = await client.query(
      q.Update(
        q.Ref(q.Collection('maintenances'), id),
        { data }
      )
    );

    // Devolver el registro actualizado
    return {
      statusCode: 200,
      body: JSON.stringify({
        id,
        ...data
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    console.error('Error al actualizar mantenimiento:', error);
    
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
      body: JSON.stringify({ error: 'Error al actualizar el mantenimiento' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};