"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toNumber, createPaginationLink } from "@/lib/reports";

const RiskWhitelist = ["critico", "alerta", "estable"] as const;

function CoursePerformanceContent() {
	const searchParams = useSearchParams();
	const [data, setData] = useState<any[]>([]);
	const [total, setTotal] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const category = searchParams.get("category")?.trim() || "";
	const risk = searchParams.get("risk")?.trim() || "";
	const rawPage = searchParams.get("page");
	const rawPageSize = searchParams.get("pageSize");

	const validCategory = category && category.length > 0 ? category : undefined;
	const validRisk = risk && RiskWhitelist.includes(risk as any) ? risk : undefined;

	const page = toNumber(rawPage || "", 1);
	const pageSize = Math.min(toNumber(rawPageSize || "", 10), 50);

	const fetchData = useCallback(async () => {
		if (!validCategory && !validRisk) return;
		try {
			setLoading(true);
			setError(null);
			const params = new URLSearchParams({
				page: String(page),
				pageSize: String(pageSize),
				...(validCategory && { category: validCategory }),
				...(validRisk && { risk: validRisk }),
			});
			const response = await fetch(`/api/reports/vw_course_performance?${params}`);
			if (!response.ok) throw new Error("Error al obtener datos");
			const result = await response.json();
			setData(result.data);
			setTotal(result.total);
			setTotalPages(result.totalPages);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error desconocido");
		} finally {
			setLoading(false);
		}
	}, [page, pageSize, validCategory, validRisk]);

	useEffect(() => {
		// Siempre llamar fetchData (con o sin filtro)
		fetchData();
	}, [fetchData]);

	const makeLink = (targetPage: number) =>
		createPaginationLink({ category: validCategory || "", risk: validRisk || "" }, targetPage, pageSize);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const params = new URLSearchParams();
		const categoryValue = formData.get("category");
		const riskValue = formData.get("risk");
		if (categoryValue) params.set("category", categoryValue.toString());
		if (riskValue) params.set("risk", riskValue.toString());
		params.set("page", "1");
		params.set("pageSize", String(pageSize));
		window.location.href = `?${params.toString()}`;
	};

	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
			<div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white shadow-2xl border-b-4 border-red-600">
				<div className="max-w-7xl mx-auto px-6 py-8">
					<h1 className="text-3xl font-bold mb-2">Salud de Inventario</h1>
					<p className="text-gray-300 text-base">
						Resumen de stock y riesgo por categoria.
					</p>
				</div>
			</div>
			<div className="w-full px-6 py-10">
				<div className="max-w-6xl mx-auto bg-white/95 rounded-xl shadow-2xl border border-gray-800/30 p-6">
					<form className="flex flex-wrap gap-3 mb-6" onSubmit={handleSubmit}>
						<input
							name="category"
							placeholder="Categoria (opcional)"
							defaultValue={validCategory || ""}
							className="border border-gray-300 rounded px-3 py-2 text-sm"
						/>
						<select
							name="risk"
							defaultValue={validRisk || ""}
							className="border border-gray-300 rounded px-3 py-2 text-sm"
						>
							<option value="">Riesgo (opcional)</option>
							{RiskWhitelist.map((item) => (
								<option key={item} value={item}>
									{item}
								</option>
							))}
						</select>
						<button
							type="submit"
							className="bg-gray-900 text-white px-4 py-2 rounded text-sm"
							disabled={loading}
						>
							{loading ? "Cargando..." : "Filtrar"}
						</button>
					</form>

					{error && (
						<div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
							<p className="text-yellow-700 font-bold text-sm">
								No hay datos para los filtros indicados.
							</p>
						</div>
				{loading ? (
						<div className="text-center py-8">
							<p className="text-gray-600">Cargando datos...</p>
						</div>
					) : data.length === 0 ? (
						<div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
							<p className="text-yellow-700 font-bold text-sm">
												Categoria
							</p>
						</div>
												Riesgo
						<>
							<div className="bg-white shadow rounded-lg overflow-hidden">
												Productos
									<thead className="bg-gray-50">
										<tr>
												Stock
												Curso
											</th>
												Valor Inventario
											</th>
											<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
												Bajo Stock
											</th>
											<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
												Agotados
											</th>
											<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
												% Bajo Stock
												Periodo
											</th>
											<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
												Promedio
											<tr key={row.categoria_id}>
											<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
													<div className="font-medium text-gray-900">{row.categoria_nombre}</div>
											<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
												<td className="px-6 py-4 whitespace-nowrap">{row.nivel_riesgo}</td>
											</th>
													{row.total_productos}
									</thead>
									<tbody className="divide-y divide-gray-200">
													{row.total_stock}
											<tr key={`${row.curso_id}-${row.term}`}>
												<td className="px-6 py-4 whitespace-nowrap">
													${row.valor_inventario}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right font-mono">
													{row.productos_bajo_stock}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right font-mono">
													{row.productos_agotados}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right font-mono">
													{row.pct_bajo_stock}%
													<div className="text-xs text-gray-500">{row.curso_codigo}</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">{row.term}</td>
												<td className="px-6 py-4 whitespace-nowrap text-right font-mono">
													{row.promedio_calificaciones}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right font-mono">
													{row.total_reprobados}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right font-mono">
													{row.tasa_reprobacion}%
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							<div className="flex items-center justify-between mt-6 text-sm">
								<span className="text-gray-600">
									Pagina {page} de {totalPages} ({total} registros)
								</span>
								<div className="flex gap-3">
									{page > 1 ? (
										<Link className="text-blue-600" href={makeLink(page - 1)}>
											Anterior
										</Link>
									) : (
										<span className="text-gray-400">Anterior</span>
									)}
									{page < totalPages ? (
										<Link className="text-blue-600" href={makeLink(page + 1)}>
											Siguiente
										</Link>
									) : (
										<span className="text-gray-400">Siguiente</span>
									)}
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</main>
	);
}
export default function CoursePerformanceReport() {
	return (
		<Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
			<CoursePerformanceContent />
		</Suspense>
	);
}