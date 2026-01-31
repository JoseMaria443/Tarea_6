import { query } from '@/lib/db';
import { z } from 'zod';

const filterSchema = z.object({
  minMonto: z.coerce.number().min(0).optional().default(500),
  page: z.coerce.number().min(1).optional().default(1),
});

export default async function ReporteOrdenes({ searchParams }: { searchParams: { minMonto?: string, page?: string } }) {
  const { minMonto, page } = filterSchema.parse(searchParams); // Validación Zod [cite: 69]
  const limit = 10;
  const offset = (page - 1) * limit;

  const res = await query(
    'SELECT * FROM view_ordenes_complejas WHERE monto_final >= $1 LIMIT $2 OFFSET $3',
    [minMonto, limit, offset]
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Reporte 5: Eficiencia Operativa</h1>
      <p className="text-gray-600 mb-6">Órdenes con más de 3 tipos de productos y monto superior a ${minMonto}.</p>

      <table className="w-full border">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-2">Folio</th>
            <th className="p-2">Cliente</th>
            <th className="p-2">Productos Distintos</th>
            <th className="p-2">Monto</th>
          </tr>
        </thead>
        <tbody>
          {res.rows.map((row) => (
            <tr key={row.numero_orden} className="border-b">
              <td className="p-2 text-center">{row.numero_orden}</td>
              <td className="p-2">{row.cliente_comprador}</td>
              <td className="p-2 text-center">{row.cantidad_productos_distintos}</td>
              <td className="p-2 text-center font-bold">${row.monto_final}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}