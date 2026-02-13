"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toNumber, createPaginationLink } from "@/lib/reports";

function ProductSalesRankContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rawPage = searchParams.get("page");
  const rawPageSize = searchParams.get("pageSize");

  const page = toNumber(rawPage || "", 1);
  const pageSize = Math.min(toNumber(rawPageSize || "", 10), 50);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      const response = await fetch(`/api/reports/vw_product_sales_rank?${params}`);
      if (!response.ok) throw new Error("Error al obtener datos");
      const result = await response.json();
      setData(result.data || []);
      setTotal(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const topProduct = data[0];
  const makeLink = (targetPage: number) => createPaginationLink({}, targetPage, pageSize);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 text-white shadow-2xl border-b-4 border-rose-500">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">Ranking de Productos</h1>
          <p className="text-gray-300 text-base">Ranking por ingresos acumulados.</p>
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
              {topProduct && (
                <div className="bg-rose-50 border-l-4 border-rose-500 p-4 mb-6">
                  <p className="text-rose-800 font-bold text-sm">Producto lider</p>
                  <p className="text-xl font-semibold">{topProduct.producto_nombre}: ${topProduct.ingresos_totales}</p>
                </div>
              )}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unidades</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ingreso</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Precio prom.</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ranking</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.map((row) => (
                      <tr key={row.producto_id}>
                        <td className="px-6 py-4 whitespace-nowrap">{row.producto_nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-mono">{row.total_unidades}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-mono">${row.ingresos_totales}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-mono">${row.precio_promedio}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-mono">#{row.ranking}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-6 text-sm">
                <span className="text-gray-600">
                  Pagina {page} de {totalPages} ({total} registros)
                </span>
                <div className="flex gap-3">
                  {page > 1 ? (
                    <Link className="text-blue-600" href={makeLink(page - 1)}>
                      Anterior
                    </Link>
                  ) : (
                    <span className="text-gray-400">Anterior</span>
                  )}
                  {page < totalPages ? (
                    <Link className="text-blue-600" href={makeLink(page + 1)}>
                      Siguiente
                    </Link>
                  ) : (
                    <span className="text-gray-400">Siguiente</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ProductSalesRankReport() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <ProductSalesRankContent />
    </Suspense>
  );
}
