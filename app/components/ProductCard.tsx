import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { badgeLabels } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
	return (
		<Link href={product.slug} className="group block">
			<div className="relative aspect-3/4 bg-zinc-50 overflow-hidden rounded-sm">
				<Image
					src={product.image}
					alt={product.name}
					fill
					sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
					className="object-cover transition-transform duration-500 group-hover:scale-105"
				/>
				{product.badge && (
					<span className="absolute top-3 left-3 text-xs tracking-wide bg-white px-2 py-1 rounded-sm">
						{badgeLabels[product.badge]}
					</span>
				)}
				{!product.inStock && (
					<div className="absolute inset-0 bg-white/60 flex items-center justify-center">
						<span className="text-xs text-zinc-400 tracking-wider uppercase">
							Немає в наявності
						</span>
					</div>
				)}
			</div>

			<div className="mt-3 flex items-start justify-between gap-2">
				<div>
					<p className="text-sm text-zinc-900 group-hover:underline underline-offset-2 decoration-zinc-300">
						{product.name}
					</p>
					<p className="text-xs text-zinc-400 mt-0.5">{product.category}</p>
				</div>
				<div className="text-right shrink-0">
					<p className="text-sm text-zinc-900">{product.price} ₴</p>
					{product.originalPrice && (
						<p className="text-xs text-zinc-400 line-through">
							{product.originalPrice} ₴
						</p>
					)}
				</div>
			</div>
		</Link>
	);
}
