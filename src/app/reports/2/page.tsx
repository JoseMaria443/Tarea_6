import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ReporteInventario() {
  const res = await query('SELECT * FROM inventario_status');

  const alertas = res.rows.filter((r: any) => r.semaforo_stock !== 'OK').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-red-900 to-gray-800 text-white shadow-2xl border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold mb-2">Reporte 2: Control de Inventario</h1>
          <p className="text-gray-300">Estado actual de productos y valorización de almacén</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Alert Card */}
        <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-6 rounded-xl shadow-2xl mb-8 border-2 border-red-500">
          <p className="text-red-200 text-sm font-semibold mb-1">PRODUCTOS QUE REQUIEREN ATENCIÓN</p>
          <h2 className="text-4xl font-bold">{alertas} productos</h2>
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-900 to-gray-800">
              <tr className="border-b-2 border-red-600">
                <th className="px-6 py-4 text-left font-bold text-red-400">Producto</th>
                <th className="px-6 py-4 text-left font-bold text-red-400">Descripción</th>
                <th className="px-6 py-4 text-left font-bold text-red-400">Stock</th>
                <th className="px-6 py-4 text-left font-bold text-red-400">Valor Total</th>
                <th className="px-6 py-4 text-left font-bold text-red-400">Estado</th>
              </tr>
            </thead>
            <tbody>
              {res.rows.map((row: any, i: number) => (
                <tr key={i} className="border-t border-gray-700 hover:bg-gray-700 transition">
                  <td className="px-6 py-4 font-semibold text-white">{row.producto}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{row.info}</td>
                  <td className="px-6 py-4 text-gray-300 font-semibold">{row.stock}</td>
                  <td className="px-6 py-4 text-red-400 font-bold">${Number(row.valor_inventario_total).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      row.semaforo_stock === 'AGOTADO' ? 'bg-red-600 text-white' :
                      row.semaforo_stock === 'REABASTECER' ? 'bg-yellow-600 text-white' :
                      'bg-green-600 text-white'
                    }`}>
                      {row.semaforo_stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}