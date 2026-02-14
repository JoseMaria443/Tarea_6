**Tarea 6: Lab Reportes: Next.js Reports Dashboard (PostgreSQL + Views + Docker Compose)**

**Funcionamiento**

*Base de datos*

En la carpeta de db se crea el esquema, se insertan los datos a probar y se crean las 5 views solicitadas en la actividad. Tambien se crean indices para optimizar consultas y se configura el usuario con permisos de solo lectura para las views.

*Conexion*

La conexion usa la variable de entorno DATABASE_URL, apuntando al contenedor de Postgres en el puerto 5432 dentro de la red de Docker.

*Reportes*

Los reportes se visualizan desde el front. Cada view tiene su ruta, con filtros validados con Zod, queries parametrizadas y paginacion server-side para evitar sobrecarga.

*Docker Compose*

Docker Compose levanta Postgres y ejecuta los scripts SQL de manera automatica.

*INDEXES*

Para que Next.js funcione de manera mas eficiente se crearon los siguientes indices:
```
CREATE INDEX IF NOT EXISTS idx_orden_detalles_orden_id ON orden_detalles(orden_id);
CREATE INDEX IF NOT EXISTS idx_orden_detalles_producto_id ON orden_detalles(producto_id);
CREATE INDEX IF NOT EXISTS idx_productos_categoria_id ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_ordenes_usuario_status ON ordenes(usuario_id, status);
```

**Requisitos de reportes**

- Minimo 2 reportes incluyen filtros validados con Zod y queries parametrizadas.
- Minimo 2 reportes incluyen paginacion server-side (limit/offset o cursor).
- Evidencia de uso descrita en este README.

**Ejecucion**

1) Copia .env.example a .env y ajusta valores locales.
2) Ejecuta el proyecto:
```
docker compose up --build
```

Resultado esperado:
- postgres service_healthy
- next.js Ready in ...
- http://localhost:3000

**Rutas de reportes**

- /reports/vw_attendance_by_group
- /reports/vw_course_performance
- /reports/vw_rank_students
- /reports/vw_students_at_risk
- /reports/vw_teacher_load

**Evidencia de filtros y paginacion**

- Filtros validados con Zod: reportes de clientes y productos con whitelists y validacion en API.
- Paginacion server-side: reportes de clientes y ordenes con limit/offset y navegacion por pagina.
