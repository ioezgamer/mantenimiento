const { query } = require("./utils/db");

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== "PUT") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Método no permitido" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const id = event.path.split("/").pop();
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "ID de mantenimiento no proporcionado" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const data = JSON.parse(event.body);

    if (
      !data.equipo ||
      !data.tipo ||
      !data.fechaMantenimiento ||
      !data.estado ||
      !data.usuario
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Faltan campos requeridos" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    // CORREGIDO: Nombres de columna coinciden con la BD y se elimina 'updated_at' que no existe en la tabla
    const result = await query(
      `UPDATE maintenances 
      SET equipo = $1, tipo = $2, fechamantenimiento = $3, descripcion = $4, 
          estado = $5, usuario = $6, fechaproximo = $7, notas = $8
      WHERE id = $9
      RETURNING *`,
      [
        data.equipo,
        data.tipo,
        data.fechaMantenimiento,
        data.descripcion || "",
        data.estado,
        data.usuario,
        data.fechaProximo,
        data.notas || "",
        id,
      ]
    );

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "Mantenimiento no encontrado para actualizar",
        }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const updatedItem = result.rows[0];

    // Mapear columnas de la BD (snake_case) a camelCase para el frontend
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: updatedItem.id,
        equipo: updatedItem.equipo,
        tipo: updatedItem.tipo,
        fechaMantenimiento: updatedItem.fechamantenimiento,
        descripcion: updatedItem.descripcion,
        estado: updatedItem.estado,
        usuario: updatedItem.usuario,
        fechaProximo: updatedItem.fechaproximo,
        notas: updatedItem.notas,
      }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    console.error("Error al actualizar mantenimiento:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error al actualizar el mantenimiento",
        details: error.message,
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
