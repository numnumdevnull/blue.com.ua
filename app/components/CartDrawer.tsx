"use client";

import Image from "next/image";
import Link from "next/link";
import { cartTotal, useCartStore } from "@/lib/cart-store";

export default function CartDrawer() {
	const { items, isOpen, closeCart, removeItem, updateQty, clear } =
		useCartStore();
	const total = cartTotal(items);

	return (
		<>
			{/* backdrop */}
			{isOpen && (
				<button
					type="button"
					tabIndex={-1}
					aria-label="Закрити кошик"
					className="fixed inset-0 z-40 w-full bg-black/20 backdrop-blur-sm"
					onClick={closeCart}
				/>
			)}

			{/* drawer */}
			<aside
				className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
				aria-label="Кошик"
			>
				{/* header */}
				<div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
					<h2 className="text-sm font-semibold tracking-widest uppercase">
						Кошик
					</h2>
					<button
						type="button"
						onClick={closeCart}
						aria-label="Закрити кошик"
						className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinecap="round"
							aria-hidden="true"
						>
							<path d="M18 6 6 18M6 6l12 12" />
						</svg>
					</button>
				</div>

				{/* items */}
				<div className="flex-1 overflow-y-auto px-6 py-4">
					{items.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full gap-4 text-center">
							<p className="text-zinc-400 text-sm">Кошик порожній</p>
							<button
								type="button"
								onClick={closeCart}
								className="text-sm text-zinc-900 underline underline-offset-4"
							>
								Продовжити покупки
							</button>
						</div>
					) : (
						<ul className="divide-y divide-zinc-100">
							{items.map(({ product, qty }) => (
								<li key={product.slug} className="flex gap-4 py-4">
									<Link
										href={product.slug}
										onClick={closeCart}
										className="relative w-16 h-20 bg-zinc-50 rounded-sm overflow-hidden shrink-0"
									>
										<Image
											src={product.image}
											alt={product.name}
											fill
											sizes="64px"
											className="object-cover"
										/>
									</Link>

									<div className="flex-1 min-w-0">
										<Link
											href={product.slug}
											onClick={closeCart}
											className="text-sm font-medium leading-snug hover:underline line-clamp-2"
										>
											{product.name}
										</Link>
										<p className="text-sm text-zinc-500 mt-1">
											{product.price} ₴
										</p>

										<div className="flex items-center gap-3 mt-2">
											<div className="flex items-center border border-zinc-200 rounded-full">
												<button
													type="button"
													onClick={() => updateQty(product.slug, qty - 1)}
													aria-label="Зменшити кількість"
													className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
												>
													−
												</button>
												<span className="w-6 text-center text-sm">{qty}</span>
												<button
													type="button"
													onClick={() => updateQty(product.slug, qty + 1)}
													aria-label="Збільшити кількість"
													className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
												>
													+
												</button>
											</div>

											<button
												type="button"
												onClick={() => removeItem(product.slug)}
												aria-label="Видалити товар"
												className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
											>
												Видалити
											</button>
										</div>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>

				{/* footer */}
				{items.length > 0 && (
					<div className="px-6 py-5 border-t border-zinc-100">
						<div className="flex justify-between text-sm mb-4">
							<span className="text-zinc-500">Разом</span>
							<span className="font-semibold">{total} ₴</span>
						</div>
						<button
							type="button"
							className="w-full py-3.5 bg-zinc-900 text-white text-sm tracking-wide rounded-full hover:bg-zinc-700 transition-colors"
						>
							Оформити замовлення
						</button>
						<button
							type="button"
							onClick={clear}
							className="w-full mt-2 py-2 text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
						>
							Очистити кошик
						</button>
					</div>
				)}
			</aside>
		</>
	);
}
