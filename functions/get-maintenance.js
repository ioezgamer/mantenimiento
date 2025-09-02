const { query } = require('./utils/neon');

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

    // Consultar el mantenimiento en Neon DB
    const result = await query('SELECT * FROM maintenances WHERE id = $1', [id]);
    
    // Verificar si se encontró el mantenimiento
    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Mantenimiento no encontrado' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    const item = result.rows[0];
    
    // Devolver el mantenimiento encontrado
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: item.id,
        equipo: item.equipo,
        tipo: item.tipo,
        fechaMantenimiento: item.fecha_mantenimiento,
        descripcion: item.descripcion,
        estado: item.estado,
        usuario: item.usuario,
        fechaProximo: item.proximo_mantenimiento
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    console.error('Error al obtener mantenimiento:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al obtener el mantenimiento', details: error.message }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};