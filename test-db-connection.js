// Script para probar la conexión con FaunaDB
require('dotenv').config();
const faunadb = require('faunadb');
const q = faunadb.query;

// Verificar que la clave de FaunaDB esté configurada
if (!process.env.FAUNA_SECRET) {
  console.error('Error: La variable de entorno FAUNA_SECRET no está configurada.');
  console.log('Por favor, crea un archivo .env con la variable FAUNA_SECRET=tu-clave-secreta');
  process.exit(1);
}

// Inicializar el cliente de FaunaDB
const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET
});

async function testConnection() {
  console.log('Probando conexión con FaunaDB...');
  
  try {
    // Intentar obtener la colección de mantenimientos
    const collections = await client.query(
      q.Map(
        q.Paginate(q.Collections()),
        q.Lambda('ref', q.Get(q.Var('ref')))
      )
    );
    
    console.log('✅ Conexión exitosa con FaunaDB');
    console.log('Colecciones disponibles:');
    collections.data.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Verificar si existe la colección de mantenimientos
    const maintenanceCollection = collections.data.find(c => c.name === 'maintenances');
    
    if (maintenanceCollection) {
      console.log('\n✅ La colección "maintenances" existe');
      
      // Intentar obtener los índices
      const indices = await client.query(
        q.Map(
          q.Paginate(q.Indexes()),
          q.Lambda('ref', q.Get(q.Var('ref')))
        )
      );
      
      console.log('\nÍndices disponibles:');
      const maintenanceIndices = indices.data.filter(i => i.name.includes('maintenances'));
      
      if (maintenanceIndices.length > 0) {
        maintenanceIndices.forEach(index => {
          console.log(`- ${index.name}`);
        });
      } else {
        console.log('❌ No se encontraron índices para la colección "maintenances"');
      }
      
      // Intentar obtener algunos registros
      try {
        const records = await client.query(
          q.Map(
            q.Paginate(q.Documents(q.Collection('maintenances')), { size: 5 }),
            q.Lambda('ref', q.Get(q.Var('ref')))
          )
        );
        
        console.log(`\n✅ Se encontraron ${records.data.length} registros en la colección`);
        if (records.data.length > 0) {
          console.log('Ejemplo de un registro:');
          console.log(JSON.stringify(records.data[0], null, 2));
        }
      } catch (error) {
        console.log('❌ Error al obtener registros:', error.message);
      }
    } else {
      console.log('\n❌ La colección "maintenances" no existe');
      console.log('Ejecuta primero la función setup-db para crear la colección e índices');
    }
    
  } catch (error) {
    console.error('❌ Error al conectar con FaunaDB:', error.message);
    console.error('Detalles:', error);
  }
}

testConnection().catch(error => {
  console.error('Error inesperado:', error);
});