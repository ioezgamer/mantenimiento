const { q, client } = require('./utils/fauna');

exports.handler = async (event, context) => {
  try {
    // Verificar que el método sea POST y que tenga una clave de seguridad
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Método no permitido' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // Verificar clave de seguridad (esto debería ser más seguro en producción)
    const data = JSON.parse(event.body || '{}');
    if (data.setupKey !== process.env.SETUP_KEY) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'No autorizado' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // Crear la colección para mantenimientos si no existe
    try {
      await client.query(q.CreateCollection({ name: 'maintenances' }));
      console.log('Colección maintenances creada');
    } catch (err) {
      // Si la colección ya existe, ignorar el error
      if (err.name !== 'BadRequest') {
        throw err;
      }
      console.log('La colección maintenances ya existe');
    }

    // Crear índices para búsquedas comunes
    const indices = [
      { name: 'maintenances_by_equipo', source: 'maintenances', terms: [{ field: ['data', 'equipo'] }] },
      { name: 'maintenances_by_usuario', source: 'maintenances', terms: [{ field: ['data', 'usuario'] }] },
      { name: 'maintenances_by_fecha_proximo', source: 'maintenances', terms: [{ field: ['data', 'fechaProximo'] }] }
    ];

    // Crear cada índice si no existe
    for (const indexDef of indices) {
      try {
        await client.query(q.CreateIndex(indexDef));
        console.log(`Índice ${indexDef.name} creado`);
      } catch (err) {
        // Si el índice ya existe, ignorar el error
        if (err.name !== 'BadRequest') {
          throw err;
        }
        console.log(`El índice ${indexDef.name} ya existe`);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Base de datos inicializada correctamente' }),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    console.error('Error al configurar la base de datos:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al configurar la base de datos' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};