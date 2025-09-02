// Corregido: Importar desde 'db.js' en lugar de 'neon.js'
const { query } = require("./utils/db.js");

exports.handler = async (event, context) => {
  try {
    // Verificar que el método sea POST
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Método no permitido" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    // Obtener los datos del cuerpo de la solicitud
    const data = JSON.parse(event.body);

    // Validar datos requeridos
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

    // Crear el registro en Neon DB
    // Corregido: Nombres de columna a snake_case (ej. fecha_mantenimiento) para coincidir con la base de datos
    const result = await query(
      `INSERT INTO maintenances 
      (equipo, tipo, fecha_mantenimiento, descripcion, estado, usuario, proximo_mantenimiento, notas) 
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

    // Devolver el registro creado con su ID
    // Corregido: Mapear columnas snake_case de la BD a camelCase para el frontend
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
        fechaProximo: newItem.proximo_mantenimiento,
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
