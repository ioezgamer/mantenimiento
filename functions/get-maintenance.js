const { query } = require("./utils/db");

exports.handler = async (event, context) => {
  try {
    const id = event.path.split("/").pop();
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "ID de mantenimiento no proporcionado" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const result = await query("SELECT * FROM maintenances WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Mantenimiento no encontrado" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const item = result.rows[0];

    // Mapear columnas de la BD (snake_case) a camelCase para el frontend
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: item.id,
        equipo: item.equipo,
        tipo: item.tipo,
        fechaMantenimiento: item.fechamantenimiento,
        descripcion: item.descripcion,
        estado: item.estado,
        usuario: item.usuario,
        fechaProximo: item.fechaproximo,
        notas: item.notas,
      }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    console.error("Error al obtener mantenimiento:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error al obtener el mantenimiento",
        details: error.message,
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
