-- =================================================================
-- Qué devuelve: Productos que mas se vendemn
-- Grain: Una fila por producto.
-- Métricas: Ranking denso basado en ingresos.
-- Por qué usa Window Function: Para asignar una posición (RANK) sin agrupar filas de detalle.
-- =================================================================
CREATE OR REPLACE VIEW mas_vendidos AS
SELECT 
    p.nombre AS nombre_producto,
    SUM(od.subtotal) AS ingresos_acumulados,
    DENSE_RANK() OVER (ORDER BY SUM(od.subtotal) DESC) AS posicion_ranking
FROM productos p
JOIN orden_detalles od ON p.id = od.producto_id
GROUP BY p.nombre;

-- VERIFY
-- SELECT * FROM mas_vendidos  WHERE posicion_ranking <= 3;