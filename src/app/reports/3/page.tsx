import { query } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const pageSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
});

export default async function ReporteVIP({ searchParams }: { searchParams: { page?: string } }) {
  const { page } = pageSchema.parse(searchParams);
  const limit = 5;
  const offset = (page - 1) * limit;

    const res = await query(
    'SELECT * FROM clientes_ricos ORDER BY total_gastado DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-800 text-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold mb-2">Reporte 3: Análisis de Clientes VIP</h1>
          <p className="text-blue-200">Clientes que superan el promedio de compra</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Table */}
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-900 to-gray-800">
              <tr className="border-b-2 border-blue-600">
                <th className="px-6 py-4 text-left font-bold text-blue-400">Cliente</th>
                <th className="px-6 py-4 text-left font-bold text-blue-400">Contacto</th>
                <th className="px-6 py-4 text-left font-bold text-blue-400">Total Gastado</th>
                <th className="px-6 py-4 text-left font-bold text-blue-400">% Contribución</th>
              </tr>
            </thead>
            <tbody>
              {res.rows.map((row: any, i: number) => (
                <tr key={i} className="border-t border-gray-700 hover:bg-gray-700 transition">
                  <td className="px-6 py-4 font-semibold text-white">{row.cliente}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{row.contacto}</td>
                  <td className="px-6 py-4 text-blue-400 font-bold">${row.total_gastado.toLocaleString()}</td>
                  <td className="px-6 py-4 font-semibold text-gray-300">{row.porcentaje_contribucion}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex gap-3 justify-center flex-wrap">
          {page > 1 && <a href={`?page=${page - 1}`} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition border-2 border-blue-500">← Anterior</a>}
          <span className="px-4 py-2 bg-gray-800 text-blue-400 rounded-lg font-semibold border-2 border-blue-600">Página {page}</span>
          <a href={`?page=${page + 1}`} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition border-2 border-blue-500">Siguiente →</a>
        </div>
      </div>
    </div>
  );
}