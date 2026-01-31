import { query } from '@/lib/db';

export default async function ReporteRanking() {
  const res = await query('SELECT * FROM view_ranking_productos');
  const topProducto = res.rows[0]?.nombre_producto || "N/A";

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Reporte 4: Ranking de Ventas</h1>
      <div className="my-4 p-4 bg-green-50 border-l-4 border-green-500">
        <p className="text-green-700 font-bold text-xl">Líder en ventas: {topProducto}</p>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Posición</th>
            <th className="p-2">Producto</th>
            <th className="p-2">Ingresos</th>
          </tr>
        </thead>
        <tbody>
          {res.rows.map((row) => (
            <tr key={row.posicion_ranking} className={row.posicion_ranking <= 3 ? "bg-yellow-50" : ""}>
              <td className="p-2 text-center font-bold">#{row.posicion_ranking}</td>
              <td className="p-2">{row.nombre_producto}</td>
              <td className="p-2 text-center">${row.ingresos_acumulados}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}