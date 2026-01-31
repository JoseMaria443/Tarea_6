-- =================================================================
-- Qué devuelve: Analiza las ordenes mas complejas
-- Grain: Una fila por Orden (ID).
-- Métricas: Diversidad de productos por pedido.
-- Por qué usa HAVING: Para filtrar pedidos que no cumplen con el criterio de "complejidad".
-- =================================================================
CREATE OR REPLACE VIEW mas_complejas AS
SELECT 
    o.id AS numero_orden,
    u.nombre AS cliente_comprador,
    o.status AS estado_actual,
    COUNT(od.producto_id) AS cantidad_productos_distintos,
    o.total AS monto_final
FROM ordenes o
JOIN usuarios u ON o.usuario_id = u.id
JOIN orden_detalles od ON o.id = od.orden_id
GROUP BY o.id, u.nombre, o.status, o.total
HAVING COUNT(od.producto_id) >= 3;

-- VERIFY
-- SELECT * FROM mas_complejas;