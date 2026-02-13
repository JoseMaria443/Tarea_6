import Link from "next/link";

export default function Home() {
  const reports = [
    { id: 1, title: "Ventas por categoria", path: "/reports/vw_attendance_by_group", color: "from-emerald-600 to-cyan-700" },
    { id: 2, title: "Salud de inventario", path: "/reports/vw_course_performance", color: "from-orange-600 to-amber-700" },
    { id: 3, title: "Valor de clientes", path: "/reports/vw_rank_students", color: "from-blue-600 to-indigo-700" },
    { id: 4, title: "Ranking de productos", path: "/reports/vw_students_at_risk", color: "from-rose-600 to-red-700" },
    { id: 5, title: "Complejidad de ordenes", path: "/reports/vw_teacher_load", color: "from-teal-600 to-sky-700" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 text-white shadow-2xl border-b-4 border-emerald-500">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard de Reportes SQL</h1>
          <p className="text-gray-300 text-base">Ventas, inventario y clientes en tiempo real.</p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-6 py-12">
        <div className="grid grid-cols-1 gap-6">
          {reports.map((r) => (
            <Link key={r.id} href={r.path}>
              <div className={`mx-4 w-full bg-gradient-to-br ${r.color} text-white p-8 rounded-xl shadow-2xl transition-colors duration-300 cursor-pointer h-full border-2 border-gray-700 hover:border-red-400 hover:from-gray-800 hover:to-gray-700`}>
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