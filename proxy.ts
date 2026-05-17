import type { RowDataPacket } from "mysql2/promise";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import getPool from "@/lib/db";

export async function proxy(request: NextRequest) {
	const id = request.nextUrl.pathname.slice(1); // "/13332" → "13332"
	const numId = Number(id);
	if (!Number.isInteger(numId) || numId < 1 || numId > 2_147_483_647) {
		return NextResponse.next();
	}

	try {
		const pool = getPool();
		const [rows] = await pool.query<RowDataPacket[]>(
			"SELECT slug FROM tree WHERE id = ?",
			[numId],
		);

		const slug: string | null = rows[0]?.slug ?? null;
		if (slug) {
			return NextResponse.redirect(new URL(slug, request.url), { status: 301 });
		}
	} catch {
		// DB unavailable — fall through to 404
	}

	return NextResponse.next();
}

export const config = {
	// Only intercept single-segment purely numeric paths: /25, /13332
	matcher: ["/:id(\\d+)"],
};
