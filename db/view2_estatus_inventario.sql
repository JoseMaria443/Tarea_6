-- =================================================================
-- Qué devuelve: El estado actual en el que se encuentra el inventario.
-- Grain: Una fila por producto.
-- Métricas: Valor monetario del inventario (stock * precio).
-- Lógica: Usa COALESCE para evitar nulos en descripción y CASE para alertas.
-- =================================================================
CREATE OR REPLACE VIEW inventario_status AS
SELECT 
    p.nombre AS producto,
    COALESCE(p.descripcion, 'Sin descripción') AS info,
    p.stock,
    (p.stock * p.precio) AS valor_inventario_total,
    CASE 
        WHEN p.stock = 0 THEN 'AGOTADO'
        WHEN p.stock < 10 THEN 'REABASTECER'
        ELSE 'OK'
    END AS semaforo_stock
FROM productos p;

-- VERIFY
-- SELECT * FROM inventario_status WHERE semaforo_stock = 'REABASTECER';