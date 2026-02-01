import { query } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const filterSchema = z.object({
  minMonto: z.coerce.number().min(0).optional().default(500),
  page: z.coerce.number().min(1).optional().default(1),
});

export default async function ReporteOrdenes({ searchParams }: { searchParams: { minMonto?: string, page?: string } }) {
  const { minMonto, page } = filterSchema.parse(searchParams); // Validación Zod [cite: 69]
  const limit = 10;
  const offset = (page - 1) * limit;

  const res = await query(
    'SELECT * FROM mas_complejas WHERE monto_final >= $1 LIMIT $2 OFFSET $3',
    [minMonto, limit, offset]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-800 text-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold mb-2">Reporte 5: Órdenes de Alta Complejidad</h1>
          <p className="text-blue-200">Órdenes con más de 3 tipos de productos y monto superior a ${minMonto}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filter */}
        <div className="bg-gray-800 p-6 rounded-xl shadow mb-8 border-2 border-blue-600">
          <form className="flex gap-4 items-center flex-wrap">
            <div className="flex-1 min-w-max">
              <label htmlFor="minMonto" className="block font-semibold text-blue-300 mb-2">Monto mínimo:</label>
              <input type="number" id="minMonto" name="minMonto" defaultValue={minMonto} className="px-4 py-2 border-2 border-blue-500 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition h-fit border-2 border-blue-500">Filtrar</button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-900 to-gray-800">
              <tr className="border-b-2 border-blue-600">
                <th className="px-6 py-4 text-left font-bold text-blue-400">Folio</th>
                <th className="px-6 py-4 text-left font-bold text-blue-400">Cliente</th>
                <th className="px-6 py-4 text-left font-bold text-blue-400">Estado</th>
                <th className="px-6 py-4 text-left font-bold text-blue-400">Productos</th>
                <th className="px-6 py-4 text-left font-bold text-blue-400">Monto</th>
              </tr>
            </thead>
            <tbody>
              {res.rows.map((row: any) => (
                <tr key={row.numero_orden} className="border-t border-gray-700 hover:bg-gray-700 transition">
                  <td className="px-6 py-4 font-mono font-bold text-blue-400">{row.numero_orden}</td>
                  <td className="px-6 py-4 font-semibold text-white">{row.cliente_comprador}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-600 text-blue-100 rounded-full text-sm font-semibold">{row.estado_actual}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-semibold">{row.cantidad_productos_distintos}</td>
                  <td className="px-6 py-4 text-blue-400 font-bold">${row.monto_final.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex gap-3 justify-center flex-wrap">
          {page > 1 && <a href={`?page=${page - 1}&minMonto=${minMonto}`} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition border-2 border-blue-500">← Anterior</a>}
          <span className="px-4 py-2 bg-gray-800 text-blue-400 rounded-lg font-semibold border-2 border-blue-600">Página {page}</span>
          <a href={`?page=${page + 1}&minMonto=${minMonto}`} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition border-2 border-blue-500">Siguiente →</a>
        </div>
      </div>
    </div>
  );
}