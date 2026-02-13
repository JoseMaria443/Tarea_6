import { query } from "@/lib/db";
import { buildWhereClause } from "@/lib/reports";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const status = searchParams.get("status")?.trim() || undefined;
		const page = parseInt(searchParams.get("page") || "1");
		const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "10"), 50);

		const validStatus = status && status.length > 0 ? status : undefined;

		const filters: string[] = [];
		const values: Array<string | number> = [];

		if (validStatus) {
			values.push(validStatus);
			filters.push(`estado_orden = $${values.length}`);
		}

		const where = buildWhereClause(filters, values);
		const offset = (page - 1) * pageSize;

		const countRes = await query(
			`SELECT COUNT(*)::int AS total FROM vw_order_complexity ${where}`,
			values
		);
		const total = countRes.rows[0]?.total ?? 0;
		const totalPages = Math.max(1, Math.ceil(total / pageSize));

		const dataRes = await query(
			`SELECT * FROM vw_order_complexity ${where} ORDER BY productos_distintos DESC, monto_total DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
			[...values, pageSize, offset]
		);
		const data = dataRes.rows;

		return NextResponse.json({ data, total, totalPages, page, pageSize });
	} catch (error) {
		console.error("Error en API vw_teacher_load:", error);
		return NextResponse.json(
			{ error: "Error al obtener datos" },
			{ status: 500 }
		);
	}
}
