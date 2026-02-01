-- =================================================================
-- SEGURIDAD: ROLES Y PERMISOS
-- =================================================================

-- 1. Crear el rol para la aplicación (sin permisos de superusuario)
-- Nota: En producción, la contraseña vendría de una variable de entorno.
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'chema') THEN
    CREATE ROLE chema WITH LOGIN PASSWORD 'Chema3001';
  END IF;
END $$;

-- 2. Permisos de conexión
GRANT CONNECT ON DATABASE postgres TO chema;
GRANT USAGE ON SCHEMA public TO chema;

-- 3. Acceso RESTRINGIDO (Solo SELECT sobre las VIEWS)
-- La app NO puede tocar las tablas directamente (Requisito PDF)
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM chema;
GRANT SELECT ON ventas_por_categoria TO chema;
GRANT SELECT ON inventario_status TO chema;
GRANT SELECT ON clientes_ricos TO chema;
GRANT SELECT ON mas_vendidos TO chema;
GRANT SELECT ON mas_complejas TO chema;

