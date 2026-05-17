import Link from "next/link";
import { categoryLinks } from "@/lib/products";
import { getAllProducts } from "@/lib/products-db";
import ProductCard from "./components/ProductCard";

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>;
}) {
	const { q } = await searchParams;
	const products = await getAllProducts({ q });

	return (
		<main className="max-w-6xl mx-auto px-6 py-12">
			<section className="mb-14">
				<p className="text-xs tracking-widest uppercase text-zinc-400 mb-3">
					Нова колекція
				</p>
				<h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight max-w-md">
					Прості речі,
					<br />
					зроблені якісно.
				</h1>
			</section>

			<div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between mb-10 border-b border-zinc-100 pb-6">
				<nav className="flex items-center gap-6">
					<Link
						href="/"
						className="text-sm text-zinc-900 underline underline-offset-4 decoration-1"
					>
						Всі
					</Link>
					{categoryLinks.map((cat) => (
						<Link
							key={cat.slug}
							href={cat.slug}
							className="text-sm text-zinc-400 hover:text-zinc-900 transition-colors"
						>
							{cat.label}
						</Link>
					))}
				</nav>

				<form
					method="GET"
					action="/"
					className="flex items-center gap-2 border-b border-zinc-200 focus-within:border-zinc-900 transition-colors pb-0.5"
				>
					<input
						type="search"
						name="q"
						defaultValue={q}
						placeholder="Пошук..."
						className="w-40 text-sm outline-none placeholder:text-zinc-300 bg-transparent"
					/>
					<button
						type="submit"
						aria-label="Знайти"
						className="text-zinc-400 hover:text-zinc-900 transition-colors"
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<circle cx="11" cy="11" r="7" />
							<path d="m21 21-4.35-4.35" />
						</svg>
					</button>
				</form>
			</div>

			{products.length === 0 ? (
				<p className="text-zinc-400 text-sm py-20 text-center">
					Товарів не знайдено.
				</p>
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			)}
		</main>
	);
}
