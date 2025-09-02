const { q, client } = require('./utils/fauna');

exports.handler = async (event, context) => {
  try {
    // Consultar todos los mantenimientos en la colección
    const response = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('maintenances'))),
        q.Lambda('ref', q.Get(q.Var('ref')))
      )
    );

    // Formatear los datos para la respuesta
    const maintenances = response.data.map(item => ({
      id: item.ref.id,
      ...item.data
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(maintenances),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    console.error('Error al obtener mantenimientos:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al obtener los mantenimientos' }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
};