import type { NextRequest } from "next/server";
import { getAllProducts } from "@/lib/products-db";

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const categorySlug = searchParams.get("categorySlug") ?? undefined;
	const q = searchParams.get("q") ?? undefined;

	const result = await getAllProducts({ categorySlug, q });
	return Response.json(result);
}
