\getenv APP_DB_USER
\getenv APP_DB_PASSWORD

DO $$
DECLARE
  v_user text := :'APP_DB_USER';
  v_pass text := :'APP_DB_PASSWORD';
BEGIN
  IF v_user IS NULL OR v_user = '' THEN
    RAISE EXCEPTION 'APP_DB_USER no definido';
  END IF;
  IF v_pass IS NULL OR v_pass = '' THEN
    RAISE EXCEPTION 'APP_DB_PASSWORD no definido';
  END IF;

  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = v_user) THEN
    EXECUTE format('CREATE ROLE %I WITH LOGIN PASSWORD %L', v_user, v_pass);
  ELSE
    EXECUTE format('ALTER ROLE %I WITH LOGIN PASSWORD %L', v_user, v_pass);
  END IF;
END $$;

DO $$
DECLARE
  v_user text := :'APP_DB_USER';
BEGIN
  EXECUTE format('GRANT CONNECT ON DATABASE %I TO %I', current_database(), v_user);
  EXECUTE format('GRANT USAGE ON SCHEMA public TO %I', v_user);
END $$;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;

DO $$
DECLARE
  v_user text := :'APP_DB_USER';
BEGIN
  EXECUTE format('REVOKE ALL ON ALL TABLES IN SCHEMA public FROM %I', v_user);
  EXECUTE format('REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM %I', v_user);
  EXECUTE format('REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM %I', v_user);

  EXECUTE format('GRANT SELECT ON vw_sales_by_category TO %I', v_user);
  EXECUTE format('GRANT SELECT ON vw_inventory_health TO %I', v_user);
  EXECUTE format('GRANT SELECT ON vw_customer_value TO %I', v_user);
  EXECUTE format('GRANT SELECT ON vw_product_sales_rank TO %I', v_user);
  EXECUTE format('GRANT SELECT ON vw_order_complexity TO %I', v_user);
END $$;

