"use client";

import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/products";

export default function AddToCartButton({ product }: { product: Product }) {
	const addItem = useCartStore((s) => s.addItem);

	return (
		<button
			type="button"
			onClick={() => addItem(product)}
			className="w-full sm:w-auto px-10 py-3.5 bg-zinc-900 text-white text-sm tracking-wide rounded-full hover:bg-zinc-700 transition-colors"
		>
			Додати до кошика
		</button>
	);
}
