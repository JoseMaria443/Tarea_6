-- =================================================================
-- Que devuelve: Clientes con mayor valor en pedidos pagados.
-- Grain: Una fila por cliente.
-- Metricas: total_ordenes, total_gastado, ticket_promedio,
--           porcentaje_ingresos, nivel_cliente.
-- Por que usa GROUP BY/HAVING: Agrupa por cliente y filtra por encima del
--           promedio de gasto usando HAVING.
-- Por que usa CTE: Aisla calculos de gasto y totales globales.
-- Verify:
--   SELECT * FROM vw_rank_students ORDER BY total_gastado DESC;
--   SELECT COUNT(*) FROM vw_rank_students;
-- =================================================================
CREATE OR REPLACE VIEW vw_rank_students AS
WITH customer_spend AS (
    SELECT
        o.usuario_id,
        COUNT(DISTINCT o.id) AS total_ordenes,
        SUM(o.total) AS total_gastado,
        ROUND(AVG(o.total), 2) AS ticket_promedio
    FROM ordenes o
    WHERE o.status = 'pagado'
    GROUP BY o.usuario_id
), totals AS (
    SELECT
        SUM(total_gastado) AS total_global,
        AVG(total_gastado) AS promedio_gasto
    FROM customer_spend
)
SELECT
    u.id AS usuario_id,
    u.nombre AS cliente_nombre,
    COALESCE(u.email, 'sin_email') AS cliente_email,
    cs.total_ordenes,
    cs.total_gastado,
    cs.ticket_promedio,
    ROUND(
        CASE
            WHEN t.total_global = 0 THEN 0
            ELSE (cs.total_gastado / t.total_global) * 100
        END,
        2
    ) AS porcentaje_ingresos,
    CASE
        WHEN cs.total_gastado >= 1000 THEN 'vip'
        WHEN cs.total_gastado >= 300 THEN 'alto'
        ELSE 'medio'
    END AS nivel_cliente
FROM customer_spend cs
JOIN usuarios u ON u.id = cs.usuario_id
CROSS JOIN totals t
HAVING cs.total_gastado >= t.promedio_gasto;