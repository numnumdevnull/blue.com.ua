import type { MetadataRoute } from "next";

const base =
	process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://blue.com.ua";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] },
		sitemap: `${base}/sitemap.xml`,
	};
}
