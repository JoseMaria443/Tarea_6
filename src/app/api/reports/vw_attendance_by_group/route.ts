import { query } from "@/lib/db";
import { buildWhereClause } from "@/lib/reports";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const category = searchParams.get("category")?.trim() || undefined;

		const validCategory = category && category.length > 0 ? category : undefined;

		const filters: string[] = [];
		const values: Array<string | number> = [];

		if (validCategory) {
			values.push(`%${validCategory}%`);
			filters.push(`categoria_nombre ILIKE $${values.length}`);
		}

		const where = buildWhereClause(filters, values);
		const sql = `SELECT * FROM vw_sales_by_category ${where} ORDER BY ingresos_totales DESC`;

		const res = await query(sql, values);
		const data = res.rows;

		return NextResponse.json({ data });
	} catch (error) {
		console.error("Error en API vw_attendance_by_group:", error);
		return NextResponse.json(
			{ error: "Error al obtener datos" },
			{ status: 500 }
		);
	}
}
