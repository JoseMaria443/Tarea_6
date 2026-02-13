import { query } from "@/lib/db";
import { buildWhereClause } from "@/lib/reports";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const q = searchParams.get("q")?.trim() || undefined;
		const page = parseInt(searchParams.get("page") || "1");
		const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "10"), 50);

		const validQuery = q && q.length > 0 ? q : undefined;

		const filters: string[] = [];
		const values: Array<string | number> = [];

		if (validQuery) {
			values.push(`%${validQuery}%`);
			const searchParamIndex = values.length;
			filters.push(`producto_nombre ILIKE $${searchParamIndex}`);
		}

		const where = buildWhereClause(filters, values);
		const offset = (page - 1) * pageSize;

		const countRes = await query(
			`SELECT COUNT(*)::int AS total FROM vw_product_sales_rank ${where}`,
			values
		);
		const total = countRes.rows[0]?.total ?? 0;
		const totalPages = Math.max(1, Math.ceil(total / pageSize));

		const dataRes = await query(
			`SELECT * FROM vw_product_sales_rank ${where} ORDER BY ranking ASC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
			[...values, pageSize, offset]
		);
		const data = dataRes.rows;

		return NextResponse.json({ data, total, totalPages, page, pageSize });
	} catch (error) {
		console.error("Error en API vw_students_at_risk:", error);
		return NextResponse.json(
			{ error: "Error al obtener datos" },
			{ status: 500 }
		);
	}
}
