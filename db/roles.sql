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
GRANT SELECT ON view_ventas_por_categoria TO chema;
GRANT SELECT ON view_inventario_status TO chema;
GRANT SELECT ON view_clientes_vip TO chema;
GRANT SELECT ON view_ranking_productos TO chema;
GRANT SELECT ON view_ordenes_complejas TO chema;

