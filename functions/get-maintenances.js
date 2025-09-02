const { query } = require('./utils/neon');

exports.handler = async (event, context) => {
  try {
    // Consultar todos los mantenimientos en la tabla
    const response = await query('SELECT * FROM maintenances ORDER BY fecha_mantenimiento DESC');

    // Formatear los datos para la respuesta
    const maintenances = response.rows.map(item => ({
      id: item.id,
      equipo: item.equipo,
      tipo: item.tipo,
      fechaMantenimiento: item.fecha_mantenimiento,
      descripcion: item.descripcion,
      estado: item.estado,
      usuario: item.usuario,
      fechaProximo: item.proximo_mantenimiento
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