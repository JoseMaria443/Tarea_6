import { query } from "@/lib/db";
import { buildWhereClause } from "@/lib/reports";
import { NextRequest, NextResponse } from "next/server";

const LevelWhitelist = ["vip", "alto", "medio"] as const;

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const name = searchParams.get("name")?.trim() || undefined;
		const level = searchParams.get("level")?.trim() || undefined;
		const page = parseInt(searchParams.get("page") || "1");
		const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "10"), 50);

		const validName = name && name.length > 0 ? name : undefined;
		const validLevel = level && LevelWhitelist.includes(level as any) ? level : undefined;

		const filters: string[] = [];
		const values: Array<string | number> = [];

		if (validName) {
			values.push(`%${validName}%`);
			filters.push(`(cliente_nombre ILIKE $${values.length} OR cliente_email ILIKE $${values.length})`);
		}

		if (validLevel) {
			values.push(validLevel);
			filters.push(`nivel_cliente = $${values.length}`);
		}

		const where = buildWhereClause(filters, values);
		const offset = (page - 1) * pageSize;

		const countRes = await query(
			`SELECT COUNT(*)::int AS total FROM vw_customer_value ${where}`,
			values
		);
		const total = countRes.rows[0]?.total ?? 0;
		const totalPages = Math.max(1, Math.ceil(total / pageSize));

		const dataRes = await query(
			`SELECT * FROM vw_customer_value ${where} ORDER BY total_gastado DESC, cliente_nombre ASC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
			[...values, pageSize, offset]
		);
		const data = dataRes.rows;

		return NextResponse.json({ data, total, totalPages, page, pageSize });
	} catch (error) {
		console.error("Error en API vw_rank_students:", error);
		return NextResponse.json(
			{ error: "Error al obtener datos" },
			{ status: 500 }
		);
	}
}
