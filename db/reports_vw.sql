-- ============================================
-- Que devuelve: Resumen de ventas por categoria (solo pedidos pagados).
-- Grain: Una fila por categoria.
-- Metricas: total_ordenes, total_items, ingresos_totales, ticket_promedio, porcentaje_ingresos.
-- Por que usa GROUP BY/HAVING: Agrupa por categoria y filtra categorias con al menos 2 lineas de detalle.
-- Verify:
--   SELECT * FROM vw_sales_by_category ORDER BY ingresos_totales DESC;
--   SELECT SUM(ingresos_totales) FROM vw_sales_by_category;
-- ============================================
CREATE OR REPLACE VIEW vw_sales_by_category AS
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

-- ============================================
-- Que devuelve: Estado del inventario por categoria.
-- Grain: Una fila por categoria.
-- Metricas: total_productos, total_stock, valor_inventario, productos_bajo_stock, productos_agotados, pct_bajo_stock, nivel_riesgo.
-- Por que usa GROUP BY/HAVING: Agrupa por categoria para resumen del inventario.
-- Verify:
--   SELECT * FROM vw_inventory_health ORDER BY pct_bajo_stock DESC;
--   SELECT SUM(valor_inventario) FROM vw_inventory_health;
-- ============================================
CREATE OR REPLACE VIEW vw_inventory_health AS
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

-- ============================================
-- Que devuelve: Clientes con mayor valor en pedidos pagados.
-- Grain: Una fila por cliente.
-- Metricas: total_ordenes, total_gastado, ticket_promedio, porcentaje_ingresos, nivel_cliente.
-- Por que usa GROUP BY/HAVING: Agrupa por cliente en el CTE y filtra clientes con gasto >= promedio.
-- Verify:
--   SELECT * FROM vw_customer_value ORDER BY total_gastado DESC;
--   SELECT COUNT(*) FROM vw_customer_value;
-- ============================================
CREATE OR REPLACE VIEW vw_customer_value AS
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
WHERE cs.total_gastado >= t.promedio_gasto;

-- ============================================
-- Que devuelve: Ranking de productos por ingresos.
-- Grain: Una fila por producto.
-- Metricas: total_unidades, ingresos_totales, precio_promedio, ranking.
-- Por que usa GROUP BY/HAVING: Agrupa por producto para calcular ventas y usa window function para el ranking.
-- Verify:
--   SELECT * FROM vw_product_sales_rank ORDER BY ranking;
--   SELECT * FROM vw_product_sales_rank WHERE ranking <= 3;
-- ============================================
CREATE OR REPLACE VIEW vw_product_sales_rank AS
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

-- ============================================
-- Que devuelve: Ordenes con multiples productos y su complejidad.
-- Grain: Una fila por orden.
-- Metricas: productos_distintos, total_items, monto_total, precio_promedio_item, nivel_complejidad.
-- Por que usa GROUP BY/HAVING: Agrupa por orden y filtra ordenes con al menos 2 productos distintos.
-- Verify:
--   SELECT * FROM vw_order_complexity ORDER BY productos_distintos DESC;
--   SELECT COUNT(*) FROM vw_order_complexity;
-- ============================================
CREATE OR REPLACE VIEW vw_order_complexity AS
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
