import Link from 'next/link';

export default function Home() {
  const reports = [
    { id: 1, title: "Rendimiento por Categoría", path: "/reports/1", color: "from-blue-600 to-blue-700" },
    { id: 2, title: "Estado Crítico de Inventario", path: "/reports/2", color: "from-red-600 to-red-700" },
    { id: 3, title: "Análisis de Clientes VIP", path: "/reports/3", color: "from-blue-500 to-blue-600" },
    { id: 4, title: "Ranking de Productos", path: "/reports/4", color: "from-red-500 to-red-600" },
    { id: 5, title: "Órdenes de Alta Complejidad", path: "/reports/5", color: "from-gray-800 to-gray-900" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white shadow-2xl border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-5xl font-bold mb-3">Dashboard Operativo</h1>
          <p className="text-gray-300 text-lg">Monitoreo integral de ventas, inventario y desempeño empresarial</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((r) => (
            <Link key={r.id} href={r.path}>
              <div className={`bg-gradient-to-br ${r.color} text-white p-8 rounded-xl shadow-2xl hover:shadow-red-500/50 hover:scale-105 transition-all duration-300 cursor-pointer h-full border-2 border-gray-700`}>
                <h2 className="text-2xl font-bold mb-2">Reporte #{r.id}</h2>
                <p className="text-white/90 text-sm">{r.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}