-- =================================================================
-- Qué devuelve: Clientes que registraron mas comprar
-- Grain: Una fila por usuario.
-- Métricas: Gasto acumulado y ratio vs total global.
-- Por qué usa CTE: Para aislar el cálculo de sumatorias antes del filtro final.
-- =================================================================
CREATE OR REPLACE VIEW clientes_ricos AS
WITH GastoCalculado AS (
    SELECT usuario_id, SUM(total) as suma_cliente
    FROM ordenes
    WHERE status = 'pagado'
    GROUP BY usuario_id
)
SELECT 
    u.nombre AS cliente,
    u.email AS contacto,
    gc.suma_cliente AS total_gastado,
    ROUND((gc.suma_cliente / (SELECT SUM(total) FROM ordenes) * 100), 2) AS porcentaje_contribucion
FROM GastoCalculado gc
JOIN usuarios u ON u.id = gc.usuario_id
WHERE gc.suma_cliente > (SELECT AVG(suma_cliente) FROM GastoCalculado);

-- VERIFY
-- SELECT * FROM clientes_ricos ORDER BY total_gastado DESC;