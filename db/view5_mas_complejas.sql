-- =================================================================
-- Que devuelve: Ordenes con multiples productos y su complejidad.
-- Grain: Una fila por orden.
-- Metricas: productos_distintos, total_items, monto_total,
--           precio_promedio_item, nivel_complejidad.
-- Por que usa GROUP BY/HAVING: Agrupa por orden y filtra ordenes con
--           al menos 2 productos distintos.
-- Verify:
--   SELECT * FROM vw_teacher_load ORDER BY productos_distintos DESC;
--   SELECT COUNT(*) FROM vw_teacher_load;
-- =================================================================
CREATE OR REPLACE VIEW vw_teacher_load AS
SELECT
    o.id AS orden_id,
    o.status AS estado_orden,
    u.nombre AS cliente_nombre,
    COUNT(DISTINCT od.producto_id) AS productos_distintos,
    SUM(od.cantidad) AS total_items,
    SUM(od.subtotal) AS monto_total,
    ROUND(
        CASE
            WHEN SUM(od.cantidad) = 0 THEN 0
            ELSE SUM(od.subtotal) / SUM(od.cantidad)
        END,
        2
    ) AS precio_promedio_item,
    CASE
        WHEN COUNT(DISTINCT od.producto_id) >= 4 OR SUM(od.cantidad) >= 6 THEN 'alta'
        WHEN COUNT(DISTINCT od.producto_id) >= 3 THEN 'media'
        ELSE 'baja'
    END AS nivel_complejidad
FROM ordenes o
JOIN usuarios u ON u.id = o.usuario_id
JOIN orden_detalles od ON od.orden_id = o.id
GROUP BY o.id, o.status, u.nombre
HAVING COUNT(DISTINCT od.producto_id) >= 2;