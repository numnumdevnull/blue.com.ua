"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { categoryNav } from "@/lib/products";

export default function MobileMenu() {
	const [open, setOpen] = useState(false);
	const [expanded, setExpanded] = useState<string | null>(null);
	const close = () => {
		setOpen(false);
		setExpanded(null);
	};

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				aria-label="Відкрити меню"
				className="sm:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
			>
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					aria-hidden="true"
				>
					<line x1="4" y1="7" x2="20" y2="7" />
					<line x1="4" y1="12" x2="20" y2="12" />
					<line x1="4" y1="17" x2="20" y2="17" />
				</svg>
			</button>

			{/* Backdrop */}
			<div
				aria-hidden="true"
				onClick={close}
				className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
					open ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
			/>

			{/* Drawer */}
			<div
				role="dialog"
				aria-modal="true"
				aria-label="Навігація"
				aria-hidden={!open}
				className={`fixed top-0 right-0 bottom-0 z-50 w-72 bg-white flex flex-col shadow-xl transition-transform duration-300 ease-out ${
					open ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between px-6 h-16 border-b border-zinc-100 shrink-0">
					<Link
						href="/"
						onClick={close}
						className="text-sm font-semibold tracking-widest uppercase"
					>
						Blue
					</Link>
					<button
						type="button"
						onClick={close}
						aria-label="Закрити меню"
						className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							aria-hidden="true"
						>
							<path d="M18 6 6 18M6 6l12 12" />
						</svg>
					</button>
				</div>

				<nav className="flex-1 overflow-y-auto">
					{categoryNav.map((cat) => (
						<div key={cat.slug} className="border-b border-zinc-100">
							{/* Category row */}
							<div className="flex items-center">
								<Link
									href={cat.slug}
									onClick={close}
									className="flex-1 px-6 py-4 text-sm text-zinc-700 hover:text-zinc-900 transition-colors"
								>
									{cat.label}
								</Link>
								<button
									type="button"
									onClick={() =>
										setExpanded(expanded === cat.slug ? null : cat.slug)
									}
									aria-label={`Розгорнути ${cat.label}`}
									className="px-4 py-4 text-zinc-400 hover:text-zinc-900 transition-colors"
								>
									<svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className={`transition-transform duration-200 ${
											expanded === cat.slug ? "rotate-180" : ""
										}`}
										aria-hidden="true"
									>
										<path d="m6 9 6 6 6-6" />
									</svg>
								</button>
							</div>

							{/* Subcategories */}
							{expanded === cat.slug && (
								<div className="bg-zinc-50 pb-2">
									{cat.children.map((sub) => (
										<Link
											key={sub.slug}
											href={sub.slug}
											onClick={close}
											className="block px-8 py-2.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
										>
											{sub.label}
										</Link>
									))}
								</div>
							)}
						</div>
					))}
				</nav>
			</div>
		</>
	);
}
