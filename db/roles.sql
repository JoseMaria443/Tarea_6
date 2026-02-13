-- =================================================================
-- SEGURIDAD: ROLES Y PERMISOS
-- =================================================================

-- 1. Crear el rol para la aplicacion (sin permisos de superusuario)
-- Nota: En produccion, la contrasena vendria de una variable de entorno.
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user WITH LOGIN PASSWORD 'app_password';
  END IF;
END $$;

-- 2. Permisos de conexion
GRANT CONNECT ON DATABASE postgres TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;

-- 3. Acceso RESTRINGIDO (Solo SELECT sobre las VIEWS)
-- La app NO puede tocar las tablas directamente (Requisito PDF)
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_user;
GRANT SELECT ON vw_attendance_by_group TO app_user;
GRANT SELECT ON vw_course_performance TO app_user;
GRANT SELECT ON vw_rank_students TO app_user;
GRANT SELECT ON vw_students_at_risk TO app_user;
GRANT SELECT ON vw_teacher_load TO app_user;

