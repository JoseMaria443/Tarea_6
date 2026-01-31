import { query } from '@/lib/db';
import { z } from 'zod';

const pageSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
});

export default async function ReporteVIP({ searchParams }: { searchParams: { page?: string } }) {
  const { page } = pageSchema.parse(searchParams);
  const limit = 5;
  const offset = (page - 1) * limit;

    const res = await query(
    'SELECT * FROM view_clientes_vip ORDER BY total_gastado DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Reporte 3: Clientes de Alto Valor</h1>
      <p className="text-gray-600 mb-4 italic">Clientes que superan el promedio de compra.</p>

      <table className="w-full border">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-2">Cliente</th>
            <th className="p-2">Total Gastado</th>
            <th className="p-2">% Contribución</th>
          </tr>
        </thead>
        <tbody>
          {res.rows.map((row, i) => (
            <tr key={i} className="border-b text-center">
              <td className="p-2">{row.cliente}</td>
              <td className="p-2">${row.total_gastado}</td>
              <td className="p-2">{row.porcentaje_contribucion}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Controles de Paginación Simple */}
      <div className="mt-4 flex gap-2">
        {page > 1 && <a href={`?page=${page - 1}`} className="px-4 py-2 bg-blue-500 text-white rounded">Anterior</a>}
        <a href={`?page=${page + 1}`} className="px-4 py-2 bg-blue-500 text-white rounded">Siguiente</a>
      </div>
    </div>
  );
}