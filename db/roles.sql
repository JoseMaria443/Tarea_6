-- =================================================================
-- SEGURIDAD: ROLES Y PERMISOS
-- =================================================================

-- 1. Crear el rol para la aplicacion (sin permisos de superusuario)
-- Nota: En produccion, la contrasena vendria de una variable de entorno.
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'chema') THEN
    CREATE ROLE chema WITH LOGIN PASSWORD 'chema3001';
  ELSE
    ALTER ROLE chema WITH LOGIN PASSWORD 'chema3001';
  END IF;
END $$;

-- 2. Permisos de conexion
GRANT CONNECT ON DATABASE postgres TO chema;
GRANT USAGE ON SCHEMA public TO chema;

-- 3. Acceso RESTRINGIDO (Solo SELECT sobre las VIEWS)
-- La app NO puede tocar las tablas directamente (Requisito PDF)
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM chema;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM chema;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM chema;

GRANT SELECT ON vw_sales_by_category TO chema;
GRANT SELECT ON vw_inventory_health TO chema;
GRANT SELECT ON vw_customer_value TO chema;
GRANT SELECT ON vw_product_sales_rank TO chema;
GRANT SELECT ON vw_order_complexity TO chema;

