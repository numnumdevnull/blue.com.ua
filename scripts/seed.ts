import "dotenv/config";
import mysql from "mysql2/promise";
import { products, subcategoryDefs } from "../lib/products";

const categoryDefs = [
	{ key: "Clothing", slug: "/clothing", value: "Одяг" },
	{ key: "Accessories", slug: "/accessories", value: "Аксесуари" },
	{ key: "Home", slug: "/home", value: "Дім" },
] as const;

async function seed() {
	const conn = await mysql.createConnection({
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT ?? 3306),
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
	});

	console.log("Connected to MySQL\n");

	await conn.execute("DELETE FROM tree_parents");
	await conn.execute("DELETE FROM tree");
	console.log("Cleared existing tree data\n");

	const [typeRows] = await conn.query<mysql.RowDataPacket[]>(
		"SELECT id, value FROM tree_types",
	);
	const types = Object.fromEntries(
		typeRows.map((r) => [r.value, r.id]),
	) as Record<string, number>;

	async function insert(
		typeId: number,
		slug: string,
		value: string,
		meta?: Record<string, unknown>,
	): Promise<number> {
		const [res] = await conn.execute<mysql.ResultSetHeader>(
			"INSERT INTO tree (type_id, slug, value, meta) VALUES (?, ?, ?, ?)",
			[typeId, slug, value, meta ? JSON.stringify(meta) : null],
		);
		return res.insertId;
	}

	async function link(parentId: number, childId: number) {
		await conn.execute(
			"INSERT INTO tree_parents (parent_id, child_id) VALUES (?, ?)",
			[parentId, childId],
		);
	}

	// Root
	const rootId = await insert(types.Головна, "/", "Головна");
	console.log(`Головна id=${rootId}`);

	// Top-level categories
	const categoryMap: Record<string, number> = {};
	for (const cat of categoryDefs) {
		const id = await insert(types.Категорія, cat.slug, cat.value);
		await link(rootId, id);
		categoryMap[cat.slug] = id;
		console.log(`Категорія "${cat.value}" → ${cat.slug} (id=${id})`);
	}

	// Subcategories
	const subcategoryMap: Record<string, number> = {};
	console.log("\nПідкатегорії:");
	for (const sub of subcategoryDefs) {
		const parentId = categoryMap[sub.parentSlug];
		const id = await insert(types.Категорія, sub.slug, sub.label);
		await link(parentId, id);
		subcategoryMap[sub.slug] = id;
		console.log(`  "${sub.label}" → ${sub.slug} (id=${id})`);
	}

	// Products — linked to their subcategory
	console.log("\nТовари:");
	for (const p of products) {
		const productSlug = `/${p.slug}`;
		const parentId = subcategoryMap[p.subcategorySlug];
		if (!parentId) {
			console.error(
				`  ✗ No subcategory found for ${p.slug} (${p.subcategorySlug})`,
			);
			continue;
		}
		const meta = {
			price: p.price,
			...(p.originalPrice != null && { originalPrice: p.originalPrice }),
			description: p.description,
			image: p.image,
			...(p.badge != null && { badge: p.badge }),
			inStock: p.inStock,
		};
		const id = await insert(types.Товар, productSlug, p.name, meta);
		await link(parentId, id);
		console.log(`  ✓ "${p.name}" → ${productSlug} (id=${id})`);
	}

	await conn.end();
	console.log(`\nГотово. ${products.length} товарів додано.`);
}

seed().catch((err) => {
	console.error(err);
	process.exit(1);
});
