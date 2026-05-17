import type { MetadataRoute } from "next";
import { categoryLinks } from "@/lib/products";
import { getAllProducts } from "@/lib/products-db";

const base =
	process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://blue.com.ua";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const products = await getAllProducts();

	return [
		{ url: base, changeFrequency: "weekly", priority: 1 },
		...categoryLinks.map((cat) => ({
			url: `${base}${cat.slug}`,
			changeFrequency: "weekly" as const,
			priority: 0.8,
		})),
		...products.map((p) => ({
			url: `${base}${p.slug}`,
			changeFrequency: "monthly" as const,
			priority: 0.6,
		})),
	];
}
