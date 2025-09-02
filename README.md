# Aplicación de Mantenimiento con Neon DB y Netlify

Esta aplicación permite gestionar registros de mantenimiento utilizando Neon DB como base de datos PostgreSQL y Netlify para el despliegue y alojamiento.

## Características

- Gestión completa de registros de mantenimiento (crear, leer, actualizar, eliminar)
- Persistencia de datos con Neon DB (PostgreSQL) a través de funciones serverless de Netlify
- Exportación e importación de datos en formato JSON
- Estadísticas de mantenimiento y estado de tareas
- Filtrado y búsqueda de registros
- Interfaz responsiva con Tailwind CSS

## Configuración

### Requisitos previos

1. Cuenta en [Netlify](https://www.netlify.com/)
2. Cuenta en [Neon DB](https://neon.tech/)

### Pasos para configurar

1. **Crear una base de datos en Neon DB**:
   - Regístrate o inicia sesión en [Neon DB](https://neon.tech/)
   - Crea un nuevo proyecto
   - Obtén la cadena de conexión (connection string) desde el panel de control
   - Guarda la cadena de conexión para usarla más adelante

2. **Configurar variables de entorno en Netlify**:
   - Despliega tu proyecto en Netlify
   - Ve a la configuración del sitio > Build & deploy > Environment variables
   - Añade las siguientes variables:
     - `DATABASE_URL`: Tu cadena de conexión de Neon DB
     - `SETUP_KEY`: Una clave personalizada para proteger la configuración inicial (ej: "mi-clave-secreta")

3. **Inicializar la base de datos**:
   - Una vez desplegada la aplicación, visita: `https://tu-sitio-netlify.netlify.app/.netlify/functions/setup-db?key=tu-clave-secreta`
   - Esto creará la tabla necesaria en Neon DB

4. **Acceder a la aplicación**:
   - Visita la URL de tu sitio en Netlify
   - La aplicación cargará automáticamente y se conectará a Neon DB

## Desarrollo local

Para ejecutar la aplicación en modo desarrollo:

1. Clona este repositorio
2. Instala las dependencias: `npm install`
3. Crea un archivo `.env` en la raíz con las variables `DATABASE_URL` y `SETUP_KEY`
4. Instala Netlify CLI: `npm install -g netlify-cli`
5. Ejecuta: `netlify dev`

## Estructura del proyecto

- `/`: Archivos principales de la aplicación
  - `index.html`: Interfaz de usuario y lógica del cliente
  - `netlify.toml`: Configuración de Netlify
- `/functions`: Funciones serverless de Netlify
  - `get-maintenances.js`: Obtiene todos los registros
  - `get-maintenance.js`: Obtiene un registro específico
  - `create-maintenance.js`: Crea un nuevo registro
  - `update-maintenance.js`: Actualiza un registro existente
  - `delete-maintenance.js`: Elimina un registro
  - `delete-all-maintenances.js`: Elimina todos los registros (requiere clave de configuración)
  - `setup-db.js`: Configura la base de datos
  - `/utils`: Utilidades compartidas
    - `db.js`: Configuración del cliente de Neon DB (PostgreSQL)

## Licencia

MIT