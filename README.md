**Tarea 6: Lab Reportes: Next.js Reports Dashboard (PostgreSQL + Views  +Docker Compose)**

**Como iniciar**

Para iniciar la actividad solo se requerira un solo comando, ya que todo esta configurado para que asi suceda.

```bash 
docker compose up --build
```
Dicho comando es para ejecutarlo desde el gitbash, aunque tambien funciona desde powershell de windowds



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


```bash
CREATE INDEX idx_orden_detalles_composite ON orden_detalles(orden_id, producto_id);
```
Este nos es de gran ayuda ya que la mayoria de los reportes necesitan curzar la tabla de <ins>ordenes</ins> con <ins>productos</ins> por la tabla de <ins>orden_detalles</ins>, este mismo al ser un indice compuesto, ayuda a acelerar el proceso de busqueda.

```bash
CREATE INDEX idx_productos_nombre_categoria ON productos(nombre, categoria_id);
```
Este segundo indice nos ayuda a agrupar por el nombre de la categoria y a filtrar los productos, para asi encontrar la relacion entre el porducto y la categoria sin tener que revisar toda la tabla

```bash
CREATE INDEX idx_ordenes_status_total ON ordenes(status, total);
```
Por ultimo el tercer indice ayuda con la optimizacion del **WHERE** y el **HAVING**, ya que este nos manda directamente al que cumpla con las condiciones, asi ignorando aquellas que tenga una *condicion* sin procesar


**Requerimentos encontrados**

Para el correcto funcionamiento instalaremos algunas dependencias extras

```bash
npm install pg zod
```


**DESCRIPCION DEL PROYECTO**


Tu universidad organiza un hackathon. Quieren un “Muro de Firmas” para
proyectar mensajes en una pantalla.
Además, el equipo de logística quiere “extraer” firmas para:

    ● generar un listado de asistentes,

    ● integrar las firmas con otra herramienta (por ejemplo, una app o un tablero).

*Circunstancias adicionales*

Otros circunstancias del contexto en el que se encuentra:

    ● La pantalla podría usar la misma web, pero Logística puede requerir consumo automatizado.

    ● Hay riesgo de spam (mínimas validaciones).    


**RESOLUCION DEL PROYECTO**


Para la realizacion de este proyecto se utilizo next.js y sus necesidades.
Para el correcto funcionamiento de la actividad como primer paso sera entrar a la capreta correcta e intslar lo necesario.


**INDICACIONES PARA INICIAR EL PROYECTO**


``` bash
cd ACT8-C1-Implementacion-de-API-REST-vs-Server-Actions/
# esto es importante para el correcto funcionamiento de la actividad.
#luego deberemos instalar lo necesario para que funcione
npm install

```
Para poder visualizar el proyecto en el navegador de manera local debermos ejecutar el siguiente comando

```bash
npm run dev 
#esto funciona como un "boton de encendido" para el proyecto
```

Para poder visualizar el proyecto deberemos a entra a "http:localhos:3000" en el navegador o por el contrario 
desde la terminal podemos darle click a donde aparesca lo siguiente.

``` bash
-Local: http://localhost:3000 
#el puerto esta definido como 3000 a menos que el puerto este ocuapdo, next se encargara de buscar otro.
``` 

Este proyecto cuenta solamente con dos vistas, donde se visualizar la vista de las firmas, es decir donde 
podremos ver los mensjaes y quien los redacto, al igual que el apartado para agregar una nueva firma, y el 
apartado de asistencia donde se visualizara el nombre de los que hayan dejado una firma y la hora y fecha en 
que la dejaron.
