import Link from "next/link";
import { categoryNav } from "@/lib/products";
import CartButton from "./CartButton";
import MobileMenu from "./MobileMenu";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 bg-white border-b border-zinc-100">
			<div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
				<Link
					href="/"
					className="text-lg font-semibold tracking-widest uppercase"
				>
					Blue
				</Link>

				{/* Desktop nav — 2-level */}
				<nav className="hidden sm:flex items-center gap-8 text-sm text-zinc-500">
					{categoryNav.map((cat) => (
						<div key={cat.slug} className="group relative">
							<Link
								href={cat.slug}
								className="flex items-center gap-1 py-5 hover:text-zinc-900 transition-colors"
							>
								{cat.label}
								<svg
									width="10"
									height="10"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="mt-px opacity-40 group-hover:opacity-100 transition-opacity"
									aria-hidden="true"
								>
									<path d="m6 9 6 6 6-6" />
								</svg>
							</Link>

							{/* Dropdown */}
							<div className="absolute left-0 top-full w-44 bg-white border border-zinc-100 rounded-sm shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
								<ul className="py-1">
									{cat.children.map((sub) => (
										<li key={sub.slug}>
											<Link
												href={sub.slug}
												className="block px-4 py-2 text-xs text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
											>
												{sub.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
					))}
				</nav>

				<div className="flex items-center gap-1">
					<CartButton />
					<MobileMenu />
				</div>
			</div>
		</header>
	);
}
