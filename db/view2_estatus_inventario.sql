-- =================================================================
-- Que devuelve: Estado del inventario por categoria.
-- Grain: Una fila por categoria.
-- Metricas: total_productos, total_stock, valor_inventario,
--           productos_bajo_stock, productos_agotados, pct_bajo_stock.
-- Por que usa GROUP BY/HAVING: Agrupa por categoria para resumen general.
-- Verify:
--   SELECT * FROM vw_course_performance ORDER BY pct_bajo_stock DESC;
--   SELECT SUM(valor_inventario) FROM vw_course_performance;
-- =================================================================
CREATE OR REPLACE VIEW vw_course_performance AS
SELECT
    c.id AS categoria_id,
    c.nombre AS categoria_nombre,
    COUNT(p.id) AS total_productos,
    SUM(p.stock) AS total_stock,
    SUM(p.stock * p.precio) AS valor_inventario,
    SUM(CASE WHEN p.stock < 10 THEN 1 ELSE 0 END) AS productos_bajo_stock,
    SUM(CASE WHEN p.stock = 0 THEN 1 ELSE 0 END) AS productos_agotados,
    ROUND(
        CASE
            WHEN COUNT(p.id) = 0 THEN 0
            ELSE (SUM(CASE WHEN p.stock < 10 THEN 1 ELSE 0 END)::decimal / COUNT(p.id)) * 100
        END,
        2
    ) AS pct_bajo_stock,
    CASE
        WHEN SUM(CASE WHEN p.stock = 0 THEN 1 ELSE 0 END) > 0 THEN 'critico'
        WHEN SUM(CASE WHEN p.stock < 10 THEN 1 ELSE 0 END) > 0 THEN 'alerta'
        ELSE 'estable'
    END AS nivel_riesgo
FROM categorias c
LEFT JOIN productos p ON p.categoria_id = c.id
GROUP BY c.id, c.nombre;