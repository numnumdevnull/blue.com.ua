"use client";

import { cartCount, useCartStore } from "@/lib/cart-store";

export default function CartButton() {
	const { items, isOpen, openCart, closeCart } = useCartStore();
	const count = cartCount(items);

	return (
		<button
			type="button"
			aria-label="Кошик"
			onClick={() => (isOpen ? closeCart() : openCart())}
			className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
				<line x1="3" y1="6" x2="21" y2="6" />
				<path d="M16 10a4 4 0 0 1-8 0" />
			</svg>
			{count > 0 && (
				<span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-zinc-900 text-white text-[10px] font-medium rounded-full flex items-center justify-center leading-none">
					{count > 99 ? "99+" : count}
				</span>
			)}
		</button>
	);
}
