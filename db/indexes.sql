-- =================================================================
-- INDICES
-- =================================================================

-- Soporta joins por orden y agregaciones por orden
CREATE INDEX IF NOT EXISTS idx_orden_detalles_orden_id ON orden_detalles(orden_id);

-- Soporta joins por producto y ranking por ventas
CREATE INDEX IF NOT EXISTS idx_orden_detalles_producto_id ON orden_detalles(producto_id);

-- Soporta agregaciones por categoria
CREATE INDEX IF NOT EXISTS idx_productos_categoria_id ON productos(categoria_id);

-- Soporta reportes por cliente y estado
CREATE INDEX IF NOT EXISTS idx_ordenes_usuario_status ON ordenes(usuario_id, status);

