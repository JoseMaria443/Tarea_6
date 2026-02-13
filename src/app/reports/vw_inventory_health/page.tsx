"use client";

import { useCallback, useEffect, useState, Suspense } from "react";

function InventoryHealthContent() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/reports/vw_inventory_health");
      if (!response.ok) throw new Error("Error al obtener datos");
      const result = await response.json();
      setData(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalValue = data.reduce((sum, row) => sum + Number(row.valor_inventario || 0), 0);
  const criticalCount = data.filter((row) => row.nivel_riesgo === "critico").length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 text-white shadow-2xl border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">Salud de Inventario</h1>
          <p className="text-gray-300 text-base">Stock y valor por categoria con alertas.</p>
        </div>
      </div>
      <div className="w-full px-6 py-10">
        <div className="max-w-6xl mx-auto bg-white/95 rounded-xl shadow-2xl border border-gray-800/30 p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700 font-bold text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando datos...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <p className="text-yellow-700 font-bold text-sm">No hay datos disponibles.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                  <p className="text-orange-800 font-bold text-sm">Valor total</p>
                  <p className="text-xl font-semibold">${totalValue.toFixed(2)}</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="text-red-700 font-bold text-sm">Categorias criticas</p>
                  <p className="text-xl font-semibold">{criticalCount}</p>
                </div>
              </div>
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Productos</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">% Bajo stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Riesgo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.map((row) => (
                      <tr key={row.categoria_id}>
                        <td className="px-6 py-4 whitespace-nowrap">{row.categoria_nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-mono">{row.total_productos}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-mono">{row.total_stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-mono">${row.valor_inventario}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-mono">{row.pct_bajo_stock}%</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={row.nivel_riesgo === "critico" ? "text-red-600 font-semibold" : ""}>
                            {row.nivel_riesgo}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function InventoryHealthReport() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <InventoryHealthContent />
    </Suspense>
  );
}
