# Aplicación de Mantenimiento con FaunaDB y Netlify

Esta aplicación permite gestionar registros de mantenimiento utilizando FaunaDB como base de datos y Netlify para el despliegue y alojamiento.

## Características

- Gestión completa de registros de mantenimiento (crear, leer, actualizar, eliminar)
- Persistencia de datos con FaunaDB a través de funciones serverless de Netlify
- Exportación e importación de datos en formato JSON
- Estadísticas de mantenimiento
- Filtrado y búsqueda de registros
- Interfaz responsiva con Tailwind CSS

## Configuración

### Requisitos previos

1. Cuenta en [Netlify](https://www.netlify.com/)
2. Cuenta en [FaunaDB](https://fauna.com/)

### Pasos para configurar

1. **Crear una base de datos en FaunaDB**:
   - Regístrate o inicia sesión en [FaunaDB](https://fauna.com/)
   - Crea una nueva base de datos
   - Ve a "Security" y crea una nueva clave con permisos de servidor
   - Guarda la clave secreta generada

2. **Configurar variables de entorno en Netlify**:
   - Despliega tu proyecto en Netlify
   - Ve a la configuración del sitio > Build & deploy > Environment variables
   - Añade las siguientes variables:
     - `FAUNA_SECRET`: Tu clave secreta de FaunaDB
     - `SETUP_KEY`: Una clave personalizada para proteger la configuración inicial (ej: "mi-clave-secreta")

3. **Inicializar la base de datos**:
   - Una vez desplegada la aplicación, visita: `https://tu-sitio-netlify.netlify.app/.netlify/functions/setup-db?key=tu-clave-secreta`
   - Esto creará la colección y los índices necesarios en FaunaDB

4. **Acceder a la aplicación**:
   - Visita la URL de tu sitio en Netlify
   - La aplicación cargará automáticamente y se conectará a FaunaDB

## Desarrollo local

Para ejecutar la aplicación en modo desarrollo:

1. Clona este repositorio
2. Instala las dependencias: `npm install`
3. Crea un archivo `.env` en la raíz con las variables `FAUNA_SECRET` y `SETUP_KEY`
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
  - `setup-db.js`: Configura la base de datos
  - `/utils`: Utilidades compartidas
    - `fauna.js`: Configuración del cliente de FaunaDB

## Licencia

MIT