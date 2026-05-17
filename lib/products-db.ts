import type { RowDataPacket } from "mysql2/promise";
import getPool from "./db";
import type { Product } from "./products";

type ProductRow = RowDataPacket & {
	tree_id: number;
	product_slug: string;
	name: string;
	category: string;
	category_slug: string;
	meta: string | Record<string, unknown>;
};

type Meta = {
	price: number;
	originalPrice?: number;
	description: string;
	image: string;
	badge?: Product["badge"];
	inStock: boolean;
};

function rowToProduct(row: ProductRow): Product {
	const meta: Meta =
		typeof row.meta === "string" ? JSON.parse(row.meta) : row.meta;
	return {
		id: String(row.tree_id),
		slug: row.product_slug,
		name: row.name,
		price: meta.price,
		...(meta.originalPrice != null && { originalPrice: meta.originalPrice }),
		category: row.category,
		categorySlug: row.category_slug,
		description: meta.description,
		image: meta.image,
		...(meta.badge != null && { badge: meta.badge }),
		inStock: meta.inStock,
	};
}

// type_id constants from tree_types
const TYPE_PRODUCT = 3;
const TYPE_CATEGORY = 2;

const BASE_QUERY = `
  SELECT
    t.id          AS tree_id,
    t.slug        AS product_slug,
    t.value       AS name,
    t.meta,
    cat.value     AS category,
    cat.slug      AS category_slug
  FROM tree t
  JOIN tree_parents  tp  ON tp.child_id  = t.id
  JOIN tree          cat ON cat.id        = tp.parent_id
  WHERE t.type_id   = ${TYPE_PRODUCT}
    AND cat.type_id = ${TYPE_CATEGORY}
`;

type QueryOpts = {
	categorySlug?: string;
	q?: string;
};

function buildConditions(opts?: QueryOpts): {
	where: string;
	params: unknown[];
} {
	const conditions: string[] = [];
	const params: unknown[] = [];

	if (opts?.categorySlug) {
		// match direct children AND products nested under subcategories
		conditions.push("(cat.slug = ? OR cat.slug LIKE ?)");
		params.push(opts.categorySlug, `${opts.categorySlug}/%`);
	}
	if (opts?.q) {
		conditions.push(
			"(t.value LIKE ? OR JSON_EXTRACT(t.meta, '$.description') LIKE ?)",
		);
		params.push(`%${opts.q}%`, `%${opts.q}%`);
	}

	return {
		where: conditions.length ? `AND ${conditions.join(" AND ")}` : "",
		params,
	};
}

export async function getAllProducts(opts?: QueryOpts): Promise<Product[]> {
	const pool = getPool();
	const { where, params } = buildConditions(opts);
	const [rows] = await pool.query<ProductRow[]>(
		`${BASE_QUERY} ${where} ORDER BY t.id`,
		params,
	);
	return rows.map(rowToProduct);
}

export async function getProductsPaginated(
	opts?: QueryOpts & { page?: number; limit?: number },
): Promise<{ items: Product[]; total: number }> {
	const pool = getPool();
	const page = Math.max(1, opts?.page ?? 1);
	const limit = opts?.limit ?? 12;
	const offset = (page - 1) * limit;

	const { where, params } = buildConditions(opts);

	const [rows] = await pool.query<ProductRow[]>(
		`${BASE_QUERY} ${where} ORDER BY t.id LIMIT ? OFFSET ?`,
		[...params, limit, offset],
	);

	const [countRows] = await pool.query<RowDataPacket[]>(
		`SELECT COUNT(*) AS total FROM tree t
     JOIN tree_parents tp  ON tp.child_id  = t.id
     JOIN tree         cat ON cat.id        = tp.parent_id
     WHERE t.type_id   = ${TYPE_PRODUCT}
       AND cat.type_id = ${TYPE_CATEGORY}
     ${where}`,
		params,
	);

	return {
		items: rows.map(rowToProduct),
		total: countRows[0].total as number,
	};
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
	const pool = getPool();
	const [rows] = await pool.query<ProductRow[]>(
		`${BASE_QUERY} AND t.slug = ?`,
		[slug],
	);
	if (!rows.length) return null;
	return rowToProduct(rows[0]);
}

export type TreeNode = {
	id: number;
	slug: string;
	value: string;
	typeId: number;
};

export async function getNodeBySlug(slug: string): Promise<TreeNode | null> {
	const pool = getPool();
	const [rows] = await pool.query<RowDataPacket[]>(
		"SELECT id, slug, value, type_id FROM tree WHERE slug = ?",
		[slug],
	);
	if (!rows.length) return null;
	return {
		id: rows[0].id,
		slug: rows[0].slug,
		value: rows[0].value,
		typeId: rows[0].type_id,
	};
}
