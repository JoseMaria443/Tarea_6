CREATE INDEX IF NOT EXISTS idx_orden_detalles_orden_id ON orden_detalles(orden_id);

CREATE INDEX IF NOT EXISTS idx_orden_detalles_producto_id ON orden_detalles(producto_id);

CREATE INDEX IF NOT EXISTS idx_productos_categoria_id ON productos(categoria_id);

CREATE INDEX IF NOT EXISTS idx_ordenes_usuario_status ON ordenes(usuario_id, status);

