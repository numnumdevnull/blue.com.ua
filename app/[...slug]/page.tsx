import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import AddToCartButton from "@/app/components/AddToCartButton";
import Breadcrumb from "@/app/components/Breadcrumb";
import ProductCard from "@/app/components/ProductCard";
import { badgeLabels } from "@/lib/products";
import {
	getAllProducts,
	getNodeBySlug,
	getProductBySlug,
	getProductsPaginated,
} from "@/lib/products-db";

// tree_types IDs
const TYPE_CATEGORY = 2;
const TYPE_PRODUCT = 3;

// Deduplicate DB calls between generateMetadata and the page render
const getNode = cache(getNodeBySlug);
const getProduct = cache(getProductBySlug);

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const fullSlug = `/${slug.join("/")}`;
	const node = await getNode(fullSlug);
	if (!node) return {};

	if (node.typeId === TYPE_CATEGORY) {
		return {
			title: `${node.value} — Blue`,
			description: `Купити ${node.value.toLowerCase()} в магазині Blue. Якісні речі за розумною ціною.`,
		};
	}

	if (node.typeId === TYPE_PRODUCT) {
		const product = await getProduct(fullSlug);
		if (!product) return {};
		return {
			title: `${product.name} — Blue`,
			description: product.description,
			openGraph: {
				title: product.name,
				description: product.description,
				images: [
					{ url: product.image, width: 600, height: 800, alt: product.name },
				],
				type: "website",
			},
		};
	}

	return {};
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SlugPage({
	params,
	searchParams,
}: {
	params: Promise<{ slug: string[] }>;
	searchParams: Promise<{ page?: string }>;
}) {
	const { slug } = await params;
	const { page } = await searchParams;
	const fullSlug = `/${slug.join("/")}`;

	const node = await getNode(fullSlug);
	if (!node) notFound();

	if (node.typeId === TYPE_CATEGORY) {
		return (
			<CategoryPage
				slug={fullSlug}
				name={node.value}
				page={Number(page) || 1}
			/>
		);
	}

	if (node.typeId === TYPE_PRODUCT) {
		return <ProductPage slug={fullSlug} />;
	}

	notFound();
}

// ─── Category page ────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 12;

async function CategoryPage({
	slug,
	name,
	page,
}: {
	slug: string;
	name: string;
	page: number;
}) {
	const { items, total } = await getProductsPaginated({
		categorySlug: slug,
		page,
		limit: ITEMS_PER_PAGE,
	});
	const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

	return (
		<main className="max-w-6xl mx-auto px-6 py-12">
			<Breadcrumb items={[{ label: name }]} />

			<h1 className="text-3xl font-semibold tracking-tight mb-2">{name}</h1>
			<p className="text-sm text-zinc-400 mb-10">
				{total} {pluralProducts(total)}
			</p>

			{items.length === 0 ? (
				<p className="text-zinc-400 text-sm py-20 text-center">
					У цій категорії немає товарів.
				</p>
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
					{items.map((p) => (
						<ProductCard key={p.id} product={p} />
					))}
				</div>
			)}

			{totalPages > 1 && (
				<Pagination slug={slug} current={page} total={totalPages} />
			)}
		</main>
	);
}

function pluralProducts(n: number) {
	if (n % 10 === 1 && n % 100 !== 11) return "товар";
	if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20))
		return "товари";
	return "товарів";
}

function Pagination({
	slug,
	current,
	total,
}: {
	slug: string;
	current: number;
	total: number;
}) {
	return (
		<nav className="flex items-center justify-center gap-2 mt-16">
			{current > 1 && (
				<Link
					href={`${slug}?page=${current - 1}`}
					className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
				>
					← Назад
				</Link>
			)}

			{Array.from({ length: total }, (_, i) => i + 1).map((p) => (
				<Link
					key={p}
					href={`${slug}?page=${p}`}
					className={`w-8 h-8 flex items-center justify-center text-sm rounded-full transition-colors ${
						p === current
							? "bg-zinc-900 text-white"
							: "text-zinc-400 hover:text-zinc-900"
					}`}
				>
					{p}
				</Link>
			))}

			{current < total && (
				<Link
					href={`${slug}?page=${current + 1}`}
					className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
				>
					Вперед →
				</Link>
			)}
		</nav>
	);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function JsonLd({ data }: { data: Record<string, unknown> }) {
	// JSON.stringify alone does not escape </script> — replace with unicode escapes to prevent script injection
	const safe = JSON.stringify(data)
		.replace(/</g, "\\u003c")
		.replace(/>/g, "\\u003e")
		.replace(/&/g, "\\u0026");
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: safe }}
		/>
	);
}

// ─── Product page ─────────────────────────────────────────────────────────────

async function ProductPage({ slug }: { slug: string }) {
	const product = await getProduct(slug);
	if (!product) notFound();

	const related = (await getAllProducts({ categorySlug: product.categorySlug }))
		.filter((p) => p.slug !== slug)
		.slice(0, 3);

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.name,
		description: product.description,
		image: product.image,
		offers: {
			"@type": "Offer",
			price: product.price,
			priceCurrency: "UAH",
			availability: product.inStock
				? "https://schema.org/InStock"
				: "https://schema.org/OutOfStock",
		},
	};

	return (
		<main className="max-w-6xl mx-auto px-6 py-12">
			<JsonLd data={jsonLd} />

			<Breadcrumb
				items={[
					{ label: product.category, href: product.categorySlug },
					{ label: product.name },
				]}
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
				<div className="relative aspect-3/4 bg-zinc-50 rounded-sm overflow-hidden">
					<Image
						src={product.image}
						alt={product.name}
						fill
						sizes="(max-width: 768px) 100vw, 50vw"
						className="object-cover"
						priority
					/>
					{product.badge && (
						<span className="absolute top-4 left-4 text-xs tracking-wide bg-white px-2 py-1 rounded-sm">
							{badgeLabels[product.badge]}
						</span>
					)}
				</div>

				<div className="flex flex-col justify-center">
					<p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">
						{product.category}
					</p>
					<h1 className="text-3xl font-semibold tracking-tight mb-4">
						{product.name}
					</h1>

					<div className="flex items-baseline gap-3 mb-6">
						<span className="text-2xl font-medium">{product.price} ₴</span>
						{product.originalPrice && (
							<span className="text-base text-zinc-400 line-through">
								{product.originalPrice} ₴
							</span>
						)}
					</div>

					<p className="text-zinc-500 text-sm leading-relaxed mb-10">
						{product.description}
					</p>

					{product.inStock ? (
						<AddToCartButton product={product} />
					) : (
						<button
							type="button"
							disabled
							className="w-full sm:w-auto px-10 py-3.5 bg-zinc-100 text-zinc-400 text-sm tracking-wide rounded-full cursor-not-allowed"
						>
							Немає в наявності
						</button>
					)}

					<p className="mt-6 text-xs text-zinc-400">
						Безкоштовна доставка при замовленні від 150 ₴
					</p>
				</div>
			</div>

			{related.length > 0 && (
				<section className="mt-24">
					<h2 className="text-sm tracking-widest uppercase text-zinc-400 mb-8">
						Вам також може сподобатись
					</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-12">
						{related.map((p) => (
							<ProductCard key={p.id} product={p} />
						))}
					</div>
				</section>
			)}
		</main>
	);
}
