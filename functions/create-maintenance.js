const { q, client } = require('./utils/fauna');

exports.handler = async (event, context) => {
  try {
    // Verificar que el método sea POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Método no permitido' }),
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

    // Crear el registro en FaunaDB
    const result = await client.query(
      q.Create(
        q.Collection('maintenances'),
        { data }
      )
    );

    // Devolver el registro creado con su ID
    return {
      statusCode: 201,
      body: JSON.stringify({
        id: result.ref.id,
        ...data
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    console.error('Error al crear mantenimiento:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al crear el mantenimiento' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};