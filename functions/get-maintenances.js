const { query } = require("./utils/db.js");

exports.handler = async (event, context) => {
  try {
    // CORREGIDO: Usar nombre de columna 'fechamantenimiento' en ORDER BY
    const response = await query(
      "SELECT * FROM maintenances ORDER BY fechamantenimiento DESC"
    );

    // Mapear columnas de la BD (snake_case) a camelCase para el frontend
    const maintenances = response.rows.map((item) => ({
      id: item.id,
      equipo: item.equipo,
      tipo: item.tipo,
      fechaMantenimiento: item.fechamantenimiento,
      descripcion: item.descripcion,
      estado: item.estado,
      usuario: item.usuario,
      fechaProximo: item.fechaproximo,
      notas: item.notas,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(maintenances),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Error al obtener mantenimientos:", error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error al obtener los mantenimientos",
        details: error.message,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
