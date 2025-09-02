import { query } from "./utils/db.js"; // Cambia require a import por ES Modules

exports.handler = async (event, context) => {
  try {
    // Consultar todos los mantenimientos en la tabla
    const response = await query(
      "SELECT * FROM maintenances ORDER BY fechaMantenimiento DESC"
    );

    // Formatear los datos para la respuesta
    const maintenances = response.rows.map((item) => ({
      id: item.id,
      equipo: item.equipo,
      tipo: item.tipo,
      fechaMantenimiento: item.fechaMantenimiento,
      descripcion: item.descripcion,
      estado: item.estado,
      usuario: item.usuario,
      fechaProximo: item.fechaProximo,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(maintenances),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Error al obtener mantenimientos:", error.stack); // Añade stack para debug
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
