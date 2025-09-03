const { query } = require("./utils/db.js");

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Método no permitido" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const data = JSON.parse(event.body);

    if (
      !data.equipo ||
      !data.tipo ||
      !data.fechaMantenimiento ||
      !data.estado ||
      !data.usuario ||
      !data.fechaProximo
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Faltan campos requeridos" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    // CORREGIDO: Nombres de columna coinciden con la tabla de la base de datos (ej. fechamantenimiento, fechaproximo)
    const result = await query(
      `INSERT INTO maintenances 
      (equipo, tipo, "fechaMantenimiento", descripcion, estado, usuario, "fechaProximo", notas) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
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
      ]
    );

    const newItem = result.rows[0];

    // Mapear columnas de la BD (snake_case) a camelCase para el frontend
    return {
      statusCode: 201,
      body: JSON.stringify({
        id: newItem.id,
        equipo: newItem.equipo,
        tipo: newItem.tipo,
        fechaMantenimiento: newItem.fechamantenimiento,
        descripcion: newItem.descripcion,
        estado: newItem.estado,
        usuario: newItem.usuario,
        fechaProximo: newItem.fechaproximo,
        notas: newItem.notas,
      }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    console.error("Error al crear mantenimiento:", error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error al crear el mantenimiento",
        details: error.message,
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
