require('dotenv').config();
const { query, setupDatabase } = require('./functions/utils/db');

async function testConnection() {
  console.log('Probando conexión a Neon DB...');
  
  try {
    // Verificar que la variable de entorno existe
    if (!process.env.DATABASE_URL) {
      throw new Error('La variable de entorno DATABASE_URL no está definida');
    }
    
    console.log('Variable DATABASE_URL encontrada');
    
    // Probar la conexión ejecutando una consulta simple
    const result = await query('SELECT NOW() as current_time');
    console.log('Conexión exitosa a Neon DB!');
    console.log('Hora actual del servidor:', result.rows[0].current_time);
    
    // Verificar si la tabla maintenances existe
    const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'maintenances'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('La tabla "maintenances" existe');
      
      // Contar registros en la tabla
      const countResult = await query('SELECT COUNT(*) FROM maintenances');
      console.log(`Número de registros en la tabla: ${countResult.rows[0].count}`);
    } else {
      console.log('La tabla "maintenances" no existe');
      console.log('Ejecutando configuración inicial de la base de datos...');
      
      // Crear la tabla si no existe
      const setupResult = await setupDatabase();
      console.log('Resultado de la configuración:', setupResult);
    }
    
  } catch (error) {
    console.error('Error al conectar con Neon DB:', error);
  }
}

testConnection().finally(() => process.exit());