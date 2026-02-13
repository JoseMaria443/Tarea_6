"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toNumber, createPaginationLink } from "@/lib/reports";

const LevelWhitelist = ["vip", "alto", "medio"] as const;
const CustomerWhitelist = [
	"Ada Lovelace",
	"Alan Turing",
	"Grace Hopper",
	"Linus Torvalds",
	"Margaret Hamilton",
	"Donald Knuth",
] as const;

function RankStudentsContent() {
	const searchParams = useSearchParams();
	const [data, setData] = useState<any[]>([]);
	const [total, setTotal] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const name = searchParams.get("name")?.trim() || "";
	const level = searchParams.get("level")?.trim() || "";
	const rawPage = searchParams.get("page");
	const rawPageSize = searchParams.get("pageSize");

	const validName = name && name.length > 0 ? name : undefined;
	const validLevel = level && LevelWhitelist.includes(level as any) ? level : undefined;

	const page = toNumber(rawPage || "", 1);
	const pageSize = Math.min(toNumber(rawPageSize || "", 10), 50);

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const params = new URLSearchParams({
				page: String(page),
				pageSize: String(pageSize),
				...(validName && { name: validName }),
				...(validLevel && { level: validLevel }),
			});
			const response = await fetch(`/api/reports/vw_rank_students?${params}`);
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
	}, [page, pageSize, validName, validLevel]);

	useEffect(() => {
		// Siempre llamar fetchData (con o sin filtro)
		fetchData();
	}, [fetchData]);

	const makeLink = (targetPage: number) =>
		createPaginationLink({ name: validName || "", level: validLevel || "" }, targetPage, pageSize);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const params = new URLSearchParams();
		const nameValue = formData.get("name");
		const levelValue = formData.get("level");
		if (nameValue) params.set("name", nameValue.toString());
		if (levelValue) params.set("level", levelValue.toString());
		params.set("page", "1");
		params.set("pageSize", String(pageSize));
		window.location.href = `?${params.toString()}`;
	};

	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
			<div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white shadow-2xl border-b-4 border-red-600">
				<div className="max-w-7xl mx-auto px-6 py-8">
					<h1 className="text-3xl font-bold mb-2">Valor de Clientes</h1>
					<p className="text-gray-300 text-base">
						Clientes con mayor valor en ordenes pagadas.
					</p>
				</div>
			</div>
			<div className="w-full px-6 py-10">
				<div className="max-w-6xl mx-auto bg-white/95 rounded-xl shadow-2xl border border-gray-800/30 p-6">
					<form className="flex flex-wrap gap-3 mb-6" onSubmit={handleSubmit}>
						<select
							name="name"
							defaultValue={validName || ""}
							className="border border-gray-300 rounded px-3 py-2 text-sm"
						>
							<option value="">Cliente (todos)</option>
							{CustomerWhitelist.map((item) => (
								<option key={item} value={item}>
									{item}
								</option>
							))}
						</select>
						<select
							name="level"
							defaultValue={validLevel || ""}
							className="border border-gray-300 rounded px-3 py-2 text-sm"
						>
							<option value="">Nivel (opcional)</option>
							{LevelWhitelist.map((item) => (
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
						<div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
							<p className="text-red-700 font-bold text-sm">{error}</p>
						</div>
					)}

					{loading ? (
					<div className="text-center py-8">
						<p className="text-gray-600">Cargando datos...</p>
					</div>
				) : data.length === 0 ? (
						<div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
							<p className="text-yellow-700 font-bold text-sm">
								No hay datos para los filtros indicados.
							</p>
						</div>
					) : (
						<>
							<div className="bg-white shadow rounded-lg overflow-hidden">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
												Cliente
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
												Email
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
												Nivel
											</th>
											<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
												Ordenes
											</th>
											<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
												Total Gastado
											</th>
											<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
												Ticket Prom.
											</th>
											<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
												% Ingresos
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{data.map((row: any) => (
											<tr key={row.usuario_id}>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="font-medium text-gray-900">{row.cliente_nombre}</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">{row.cliente_email}</td>
												<td className="px-6 py-4 whitespace-nowrap">{row.nivel_cliente}</td>
												<td className="px-6 py-4 whitespace-nowrap text-right font-mono">
													{row.total_ordenes}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right font-mono">
													${row.total_gastado}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right font-mono">
													${row.ticket_promedio}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right font-mono">
													{row.porcentaje_ingresos}%
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

export default function RankStudentsReport() {
	return (
		<Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
			<RankStudentsContent />
		</Suspense>
	);
}
