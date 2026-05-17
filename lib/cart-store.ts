"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./products";

export type CartItem = {
	product: Product;
	qty: number;
};

type CartStore = {
	items: CartItem[];
	isOpen: boolean;
	addItem: (product: Product) => void;
	removeItem: (slug: string) => void;
	updateQty: (slug: string, qty: number) => void;
	clear: () => void;
	openCart: () => void;
	closeCart: () => void;
};

export const useCartStore = create<CartStore>()(
	persist(
		(set) => ({
			items: [],
			isOpen: false,

			addItem: (product) =>
				set((state) => {
					const existing = state.items.find(
						(i) => i.product.slug === product.slug,
					);
					if (existing) {
						return {
							items: state.items.map((i) =>
								i.product.slug === product.slug ? { ...i, qty: i.qty + 1 } : i,
							),
							isOpen: true,
						};
					}
					return {
						items: [...state.items, { product, qty: 1 }],
						isOpen: true,
					};
				}),

			removeItem: (slug) =>
				set((state) => ({
					items: state.items.filter((i) => i.product.slug !== slug),
				})),

			updateQty: (slug, qty) =>
				set((state) => ({
					items:
						qty < 1
							? state.items.filter((i) => i.product.slug !== slug)
							: state.items.map((i) =>
									i.product.slug === slug ? { ...i, qty } : i,
								),
				})),

			clear: () => set({ items: [] }),
			openCart: () => set({ isOpen: true }),
			closeCart: () => set({ isOpen: false }),
		}),
		{
			name: "blue-cart",
			// only persist items, not UI state
			partialize: (state) => ({ items: state.items }),
		},
	),
);

export function cartTotal(items: CartItem[]): number {
	return items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
}

export function cartCount(items: CartItem[]): number {
	return items.reduce((sum, i) => sum + i.qty, 0);
}
