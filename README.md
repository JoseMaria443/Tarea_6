**Tarea 6: Lab Reportes: Next.js Reports Dashboard (PostgreSQL + Views  +Docker Compose)**

**Funcionamiento**

*Base de datos*

En la carpeta de db se crea el esquema, se insertan los datos a probar y por ultimo se crean las 5 views solicitadas en la actividad, aparte de que se crear indices para la optimizacion de consultas, y para visualizar desde el front se crea el usuario "chema" con los permisos necesarios para poder visualizarla.

*Conexion*

La conexion se realizada tomando el DATABASE_URL, desde la variable de entorno para luego apuntar al contenedor que en este caso es 5432 dentro de la red de Docker.

*Reportes*

Los reportes se pueden visualizar desde el front en donde cada view esta repartida en una diferente ruta en los cuales se procesan los filtros con Zon, se parametrizan algunas querys y se realiza la paginacion para evitar el sobrecargo de informacion.

*Docker Compose*

Docker compose, en un contenedor se encarga de maneter los scripts de postgres para que asi se ejecuten de una manera "automatica".


*INDEXES*

Para que *Next.js* fucniones de manera mucha mos eficiente se realizo la implementacion de 3 diferentese indices, los cuales son los siguientes: