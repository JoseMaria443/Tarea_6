**Tarea 6: Lab Reportes: Next.js Reports Dashboard (PostgreSQL + Views  +Docker Compose)**

*INDEXES*
Para que *Next.js* fucniones de manera mucha mos eficiente se realizo la implementacion de 3 diferentese indices, los cuales son los siguientes:

```bash
CREATE INDEX idx_orden_detalles_composite ON orden_detalles(orden_id, producto_id);
```
Este nos es de gran ayuda ya que la mayoria de los reportes necesitan curzar la tabla de <ins>ordenes</ins> con <ins>productos</ins> por la tabla de <ins>orden_detalles</ins>



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
