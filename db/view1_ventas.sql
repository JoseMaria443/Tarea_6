-- =================================================================
-- Qué devuelve: Cuantas ventas se realizaron por categoría de producto.
-- Grain: Una fila por categoría.
-- Métricas: Ingresos totales, cantidad de pedidos y promedio de venta.
-- Por qué usa GROUP BY/HAVING: Agrupa productos por su categoría y filtra 
-- mediante HAVING aquellas con más de 5 registros para asegurar relevancia.
-- =================================================================
CREATE OR REPLACE VIEW ventas_por_categoria AS
SELECT 
    c.nombre AS categoria,
    COUNT(od.id) AS total_registros,
    SUM(od.subtotal) AS ingresos_totales,
    ROUND(AVG(od.subtotal), 2) AS promedio_ticket
FROM categorias c
JOIN productos p ON c.id = p.categoria_id
JOIN orden_detalles od ON p.id = od.producto_id
GROUP BY c.nombre
HAVING COUNT(od.id) > 5;

-- VERIFY
-- SELECT * FROM view_ventas_por_categoria;