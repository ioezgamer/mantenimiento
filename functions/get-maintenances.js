// Corregido: Cambiado a require para mantener consistencia con otros archivos
const { query } = require("./utils/db.js");

exports.handler = async (event, context) => {
  try {
    // Corregido: Usar nombre de columna 'fecha_mantenimiento' en ORDER BY
    const response = await query(
      "SELECT * FROM maintenances ORDER BY fecha_mantenimiento DESC"
    );

    // Formatear los datos para la respuesta
    // Corregido: Mapear columnas snake_case de la BD a camelCase para el frontend
    const maintenances = response.rows.map((item) => ({
      id: item.id,
      equipo: item.equipo,
      tipo: item.tipo,
      fechaMantenimiento: item.fecha_mantenimiento,
      descripcion: item.descripcion,
      estado: item.estado,
      usuario: item.usuario,
      fechaProximo: item.proximo_mantenimiento,
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
