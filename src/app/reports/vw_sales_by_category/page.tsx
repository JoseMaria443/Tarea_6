"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SalesByCategoryContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const minRevenue = searchParams.get("minRevenue")?.trim() || "";
  const minOrders = searchParams.get("minOrders")?.trim() || "";

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (minRevenue) params.set("minRevenue", minRevenue);
      if (minOrders) params.set("minOrders", minOrders);
      const response = await fetch(`/api/reports/vw_sales_by_category?${params}`);
      if (!response.ok) throw new Error("Error al obtener datos");
      const result = await response.json();
      setData(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [minRevenue, minOrders]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalRevenue = data.reduce((sum, row) => sum + Number(row.ingresos_totales || 0), 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    const minRevenueValue = formData.get("minRevenue");
    const minOrdersValue = formData.get("minOrders");
    if (minRevenueValue) params.set("minRevenue", minRevenueValue.toString());
    if (minOrdersValue) params.set("minOrders", minOrdersValue.toString());
    window.location.href = `?${params.toString()}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 text-white shadow-2xl border-b-4 border-emerald-500">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">Ventas por Categoria</h1>
          <p className="text-gray-300 text-base">Ingresos, ordenes e items por categoria.</p>
        </div>
      </div>
      <div className="w-full px-6 py-10">
        <div className="max-w-6xl mx-auto bg-white/95 rounded-xl shadow-2xl border border-gray-800/30 p-6">
          <form className="flex flex-wrap gap-3 mb-6" onSubmit={handleSubmit}>
            <input
              name="minRevenue"
              placeholder="Ingreso minimo"
              defaultValue={minRevenue}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <input
              name="minOrders"
              placeholder="Ordenes minimas"
              defaultValue={minOrders}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded text-sm" disabled={loading}>
              {loading ? "Cargando..." : "Filtrar"}
            </button>
          </form>

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
              <p className="text-yellow-700 font-bold text-sm">No hay datos con esos filtros.</p>
            </div>
          ) : (
            <>
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-6">
                <p className="text-emerald-800 font-bold text-sm">Ingreso total</p>
                <p className="text-xl font-semibold">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ordenes</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Items</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ingreso</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ticket</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">% Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.map((row) => (
                      <tr key={row.categoria_id}>
                        <td className="px-6 py-4 whitespace-nowrap">{row.categoria_nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-mono">{row.total_ordenes}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-mono">{row.total_items}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-mono">${row.ingresos_totales}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-mono">${row.ticket_promedio}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-mono">{row.porcentaje_ingresos}%</td>
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

export default function SalesByCategoryReport() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <SalesByCategoryContent />
    </Suspense>
  );
}
