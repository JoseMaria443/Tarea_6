import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ReporteRanking() {
  const res = await query('SELECT * FROM mas_vendidos');
  const topProducto = res.rows[0]?.nombre_producto || "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-red-900 to-gray-800 text-white shadow-2xl border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold mb-2"> Reporte 4: Ranking de Ventas</h1>
          <p className="text-gray-300">Productos con mayor desempeño en ingresos</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Top Product Card */}
        <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-8 rounded-xl shadow-2xl mb-8 border-2 border-red-500">
          <p className="text-red-200 text-sm font-semibold mb-2">LÍDER EN VENTAS</p>
          <h2 className="text-3xl font-bold">{topProducto}</h2>
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-900 to-gray-800">
              <tr className="border-b-2 border-red-600">
                <th className="px-6 py-4 text-left font-bold text-red-400">Posición</th>
                <th className="px-6 py-4 text-left font-bold text-red-400">Producto</th>
                <th className="px-6 py-4 text-left font-bold text-red-400">Ingresos Acumulados</th>
              </tr>
            </thead>
            <tbody>
              {res.rows.map((row: any) => (
                <tr key={row.posicion_ranking} className={`border-t border-gray-700 hover:bg-gray-700 transition ${
                  row.posicion_ranking <= 3 ? 'bg-gray-700' : ''
                }`}>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full font-bold ${
                      row.posicion_ranking === 1 ? 'bg-red-600 text-white text-lg' :
                      row.posicion_ranking === 2 ? 'bg-gray-600 text-white' :
                      row.posicion_ranking === 3 ? 'bg-blue-600 text-white' :
                      'text-gray-400'
                    }`}>
                      {row.posicion_ranking === 1 ? '1' : row.posicion_ranking === 2 ? '2' : row.posicion_ranking === 3 ? '3' : '#' + row.posicion_ranking}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">{row.nombre_producto}</td>
                  <td className="px-6 py-4 text-red-400 font-bold">${Number(row.ingresos_acumulados).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}