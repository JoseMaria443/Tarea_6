-- ============================================
-- Que devuelve: Ventas por categoria (solo pedidos pagados).
-- Grain: Una fila por categoria.
-- Metricas: total_ordenes, total_items, ingresos_totales, ticket_promedio, porcentaje_ingresos.
-- Por que usa GROUP BY/HAVING: Agrupa por categoria y filtra categorias con al menos 2 lineas de detalle.
-- Verify:
--   SELECT * FROM vw_attendance_by_group ORDER BY ingresos_totales DESC;
--   SELECT SUM(ingresos_totales) FROM vw_attendance_by_group;
-- ============================================
CREATE OR REPLACE VIEW vw_attendance_by_group AS
SELECT
    c.id AS categoria_id,
    c.nombre AS categoria_nombre,
    COUNT(DISTINCT o.id) AS total_ordenes,
    SUM(od.cantidad) AS total_items,
    SUM(od.subtotal) AS ingresos_totales,
    ROUND(
        CASE
            WHEN COUNT(DISTINCT o.id) = 0 THEN 0
            ELSE SUM(od.subtotal) / COUNT(DISTINCT o.id)
        END,
        2
    ) AS ticket_promedio,
    ROUND(
        CASE
            WHEN (SELECT SUM(od2.subtotal)
                  FROM ordenes o2
                  JOIN orden_detalles od2 ON od2.orden_id = o2.id
                  WHERE o2.status = 'pagado') = 0 THEN 0
            ELSE (SUM(od.subtotal) /
                (SELECT SUM(od2.subtotal)
                 FROM ordenes o2
                 JOIN orden_detalles od2 ON od2.orden_id = o2.id
                 WHERE o2.status = 'pagado')
            ) * 100
        END,
        2
    ) AS porcentaje_ingresos
FROM categorias c
JOIN productos p ON p.categoria_id = c.id
JOIN orden_detalles od ON od.producto_id = p.id
JOIN ordenes o ON o.id = od.orden_id
WHERE o.status = 'pagado'
GROUP BY c.id, c.nombre
HAVING COUNT(od.id) >= 2;