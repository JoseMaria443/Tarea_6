import { query } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const schema = z.object({
  min: z.coerce.number().min(0).optional().default(0),
});

export default async function Reporte1({ searchParams }: { searchParams: { min?: string } }) {
  const { min } = schema.parse(searchParams);

  const data = await query(
    'SELECT * FROM view_ventas_por_categoria WHERE ingresos_totales > $1', 
    [min]
  );

  const totalIngresos = data.rows.reduce((acc: number, row: any) => acc + Number(row.ingresos_totales), 0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Reporte 1: Rendimiento por Categoría</h1>
      <p className="mb-4 text-gray-600 italic">Muestra las categorías que han generado ingresos significativos.</p>

      <div className="bg-blue-100 p-4 rounded-lg mb-6 w-fit">
        <span className="text-blue-800 font-bold text-lg">Total Acumulado: ${totalIngresos.toLocaleString()}</span>
      </div>

      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Categoría</th>
            <th className="border p-2">Ventas Totales</th>
            <th className="border p-2">Ticket Promedio</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row: any, i: number) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="border p-2 font-medium">{row.categoria}</td>
              <td className="border p-2">${row.ingresos_totales}</td>
              <td className="border p-2">${row.promedio_ticket}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}