import { query } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const schema = z.object({
  min: z.coerce.number().min(0).optional().default(0),
});

export default async function Reporte1({ searchParams }: { searchParams: { min?: string } }) {
  const { min } = schema.parse(searchParams);

  const data = await query(
    'SELECT * FROM ventas_por_categoria WHERE ingresos_totales > $1', 
    [min]
  );

  const totalIngresos = data.rows.reduce((acc: number, row: any) => acc + Number(row.ingresos_totales), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-800 text-white shadow-2xl border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold mb-2">Reporte 1: Rendimiento por Categoría</h1>
          <p className="text-gray-300">Análisis de ingresos y desempeño por categoría de productos</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* KPI Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 rounded-xl shadow-2xl mb-8 border-2 border-blue-500">
          <p className="text-blue-200 text-sm font-semibold mb-1">TOTAL ACUMULADO</p>
          <h2 className="text-4xl font-bold">${totalIngresos.toLocaleString()}</h2>
        </div>

        {/* Filter */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl mb-8 border border-gray-700">
          <form className="flex gap-4 items-center flex-wrap">
            <div className="flex-1 min-w-max">
              <label htmlFor="min" className="block font-semibold text-gray-200 mb-2">Monto mínimo de ingresos:</label>
              <input type="number" id="min" name="min" defaultValue={min} className="px-4 py-2 border border-blue-500 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition h-fit border border-blue-500">Filtrar</button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-900 to-gray-800">
              <tr className="border-b-2 border-blue-600">
                <th className="px-6 py-4 text-left font-bold text-blue-400">Categoría</th>
                <th className="px-6 py-4 text-left font-bold text-blue-400">Registros</th>
                <th className="px-6 py-4 text-left font-bold text-blue-400">Ingresos Totales</th>
                <th className="px-6 py-4 text-left font-bold text-blue-400">Ticket Promedio</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row: any, i: number) => (
                <tr key={i} className="border-t border-gray-700 hover:bg-gray-700 transition">
                  <td className="px-6 py-4 font-semibold text-white">{row.categoria}</td>
                  <td className="px-6 py-4 text-gray-300">{row.total_registros}</td>
                  <td className="px-6 py-4 text-blue-400 font-bold">${Number(row.ingresos_totales).toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-300">${Number(row.promedio_ticket).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}