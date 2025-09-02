const { query } = require('./utils/neon');

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
    if (!data.equipo || !data.tipo || !data.fechaMantenimiento || !data.estado || !data.usuario) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan campos requeridos' }),
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

    // Actualizar el registro en Neon DB
    const result = await query(
      `UPDATE maintenances 
      SET equipo = $1, tipo = $2, fecha_mantenimiento = $3, descripcion = $4, 
          estado = $5, usuario = $6, proximo_mantenimiento = $7, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = $8 
      RETURNING *`,
      [
        data.equipo,
        data.tipo,
        data.fechaMantenimiento,
        data.descripcion || '',
        data.estado,
        data.usuario,
        data.fechaProximo,
        id
      ]
    );

    const updatedItem = result.rows[0];

    // Devolver el registro actualizado
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: updatedItem.id,
        equipo: updatedItem.equipo,
        tipo: updatedItem.tipo,
        fechaMantenimiento: updatedItem.fecha_mantenimiento,
        descripcion: updatedItem.descripcion,
        estado: updatedItem.estado,
        usuario: updatedItem.usuario,
        fechaProximo: updatedItem.proximo_mantenimiento
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    console.error('Error al actualizar mantenimiento:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al actualizar el mantenimiento', details: error.message }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};