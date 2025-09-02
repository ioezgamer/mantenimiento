const { query } = require('./utils/db');

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
    if (!data.equipo || !data.tipo || !data.fechaMantenimiento || !data.estado || !data.usuario) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan campos requeridos' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // Crear el registro en Neon DB
    const result = await query(
      `INSERT INTO maintenances 
      (equipo, tipo, fecha_mantenimiento, descripcion, estado, usuario, proximo_mantenimiento) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
      [
        data.equipo,
        data.tipo,
        data.fechaMantenimiento,
        data.descripcion || '',
        data.estado,
        data.usuario,
        data.fechaProximo
      ]
    );

    const newItem = result.rows[0];

    // Devolver el registro creado con su ID
    return {
      statusCode: 201,
      body: JSON.stringify({
        id: newItem.id,
        equipo: newItem.equipo,
        tipo: newItem.tipo,
        fechaMantenimiento: newItem.fecha_mantenimiento,
        descripcion: newItem.descripcion,
        estado: newItem.estado,
        usuario: newItem.usuario,
        fechaProximo: newItem.proximo_mantenimiento
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    console.error('Error al crear mantenimiento:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al crear el mantenimiento', details: error.message }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};