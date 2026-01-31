-- =================================================================
-- INDICES 
-- =================================================================

CREATE INDEX idx_orden_detalles_composite ON orden_detalles(orden_id, producto_id);

CREATE INDEX idx_productos_nombre_categoria ON productos(nombre, categoria_id);

CREATE INDEX idx_ordenes_status_total ON ordenes(status, total);

