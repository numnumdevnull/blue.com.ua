import Link from "next/link";
import { Fragment } from "react";

type Item = { label: string; href?: string };

function HomeIcon() {
	return (
		<svg
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
			<polyline points="9 21 9 12 15 12 15 21" />
		</svg>
	);
}

export default function Breadcrumb({ items }: { items: Item[] }) {
	return (
		<nav
			aria-label="Навігація сторінки"
			className="flex items-center gap-2 text-xs text-zinc-400 mb-8"
		>
			<Link
				href="/"
				aria-label="Головна"
				className="inline-flex hover:text-zinc-900 transition-colors"
			>
				<HomeIcon />
			</Link>
			{items.map((item) => (
				<Fragment key={item.label}>
					<span aria-hidden="true">/</span>
					{item.href ? (
						<Link
							href={item.href}
							className="hover:text-zinc-900 transition-colors"
						>
							{item.label}
						</Link>
					) : (
						<span className="text-zinc-700">{item.label}</span>
					)}
				</Fragment>
			))}
		</nav>
	);
}
