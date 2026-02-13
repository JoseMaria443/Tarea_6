import { query } from "@/lib/db";
import { buildWhereClause } from "@/lib/reports";
import { NextRequest, NextResponse } from "next/server";

const RiskWhitelist = ["critico", "alerta", "estable"] as const;

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const category = searchParams.get("category")?.trim() || undefined;
		const risk = searchParams.get("risk")?.trim() || undefined;
		const page = parseInt(searchParams.get("page") || "1");
		const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "10"), 50);

		const validCategory = category && category.length > 0 ? category : undefined;
		const validRisk = risk && RiskWhitelist.includes(risk as any) ? risk : undefined;

		const filters: string[] = [];
		const values: Array<string | number> = [];

		if (validCategory) {
			values.push(`%${validCategory}%`);
			filters.push(`v.categoria_nombre ILIKE $${values.length}`);
		}

		if (validRisk) {
			values.push(validRisk);
			filters.push(`v.nivel_riesgo = $${values.length}`);
		}

		const where = buildWhereClause(filters, values);
		const offset = (page - 1) * pageSize;

		const countRes = await query(
			`SELECT COUNT(*)::int AS total FROM vw_inventory_health v ${where}`,
			values
		);
		const total = countRes.rows[0]?.total ?? 0;
		const totalPages = Math.max(1, Math.ceil(total / pageSize));

		const dataRes = await query(
			`SELECT v.* FROM vw_inventory_health v ${where} ORDER BY v.pct_bajo_stock DESC, v.categoria_nombre ASC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
			[...values, pageSize, offset]
		);
		const data = dataRes.rows;

		return NextResponse.json({ data, total, totalPages, page, pageSize });
	} catch (error) {
		console.error("Error en API vw_course_performance:", error);
		return NextResponse.json(
			{ error: "Error al obtener datos" },
			{ status: 500 }
		);
	}
}
