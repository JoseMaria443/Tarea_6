import Link from 'next/link';

export default function Home() {
  const reports = [
    { id: 1, title: "Rendimiento por Categoría", path: "/reports/1" },
    { id: 2, title: "Estado Crítico de Inventario", path: "/reports/2" },
    { id: 3, title: "Análisis de Clientes VIP", path: "/reports/3" },
    { id: 4, title: "Ranking de Productos", path: "/reports/4" },
    { id: 5, title: "Órdenes de Alta Complejidad", path: "/reports/5" },
  ];

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-8 text-blue-600">Dashboard de Reportes Operativos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((r) => (
          <Link key={r.id} href={r.path} className="p-6 border rounded-xl hover:bg-gray-50 transition shadow-sm">
            <h2 className="text-xl font-semibold">Reporte #{r.id}</h2>
            <p className="text-gray-500">{r.title}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}