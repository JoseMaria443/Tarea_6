-- =================================================================
-- Que devuelve: Ranking de productos por ingresos.
-- Grain: Una fila por producto.
-- Metricas: total_unidades, ingresos_totales, precio_promedio, ranking.
-- Por que usa GROUP BY/HAVING: Agrupa por producto para calcular ventas.
-- Por que usa Window Function: Asigna ranking sin perder agregados.
-- Verify:
--   SELECT * FROM vw_students_at_risk ORDER BY ranking;
--   SELECT * FROM vw_students_at_risk WHERE ranking <= 3;
-- =================================================================
CREATE OR REPLACE VIEW vw_students_at_risk AS
SELECT
    p.id AS producto_id,
    p.nombre AS producto_nombre,
    SUM(od.cantidad) AS total_unidades,
    SUM(od.subtotal) AS ingresos_totales,
    ROUND(
        CASE
            WHEN SUM(od.cantidad) = 0 THEN 0
            ELSE SUM(od.subtotal) / SUM(od.cantidad)
        END,
        2
    ) AS precio_promedio,
    DENSE_RANK() OVER (ORDER BY SUM(od.subtotal) DESC) AS ranking
FROM productos p
JOIN orden_detalles od ON od.producto_id = p.id
GROUP BY p.id, p.nombre;