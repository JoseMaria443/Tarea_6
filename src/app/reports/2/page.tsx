import { query } from '@/lib/db';

export default async function ReporteInventario() {
  const res = await query('SELECT * FROM view_inventario_status');

  const alertas = res.rows.filter(r => r.semaforo_stock !== 'OK').length;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Reporte 2: Control de Inventario</h1>
      <p className="text-gray-600 mb-4">Estado actual de productos y valorización de almacén.</p>

      <div className="bg-orange-100 p-4 rounded-lg mb-6 w-fit">
        <span className="text-orange-800 font-bold">Atención: {alertas} productos requieren revisión.</span>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Producto</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Valor Total</th>
            <th className="border p-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {res.rows.map((row, i) => (
            <tr key={i} className="text-center">
              <td className="border p-2">{row.producto}</td>
              <td className="border p-2">{row.stock}</td>
              <td className="border p-2">${row.valor_inventario_total}</td>
              <td className={`border p-2 font-bold ${row.semaforo_stock === 'AGOTADO' ? 'text-red-600' : row.semaforo_stock === 'REABASTECER' ? 'text-yellow-600' : 'text-green-600'}`}>
                {row.semaforo_stock}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}