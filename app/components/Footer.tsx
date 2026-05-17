import Link from "next/link";

export default function Footer() {
	return (
		<footer className="border-t border-zinc-100 mt-24">
			<div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row justify-between gap-8 text-sm text-zinc-400">
				<div>
					<p className="text-black font-semibold tracking-widest uppercase mb-2">
						Blue
					</p>
					<p>Прості речі, зроблені якісно.</p>
				</div>
				<div className="flex gap-12">
					<div className="flex flex-col gap-2">
						<span className="text-black font-medium">Магазин</span>
						<Link
							href="/clothing"
							className="hover:text-black transition-colors"
						>
							Одяг
						</Link>
						<Link
							href="/accessories"
							className="hover:text-black transition-colors"
						>
							Аксесуари
						</Link>
						<Link href="/home" className="hover:text-black transition-colors">
							Дім
						</Link>
					</div>
					<div className="flex flex-col gap-2">
						<span className="text-black font-medium">Інфо</span>
						<Link href="/about" className="hover:text-black transition-colors">
							Про нас
						</Link>
						<Link
							href="/shipping"
							className="hover:text-black transition-colors"
						>
							Доставка
						</Link>
						<Link
							href="/returns"
							className="hover:text-black transition-colors"
						>
							Повернення
						</Link>
					</div>
				</div>
			</div>
			<div className="max-w-6xl mx-auto px-6 pb-8 text-xs text-zinc-300">
				© 2026 Blue. Всі права захищені.
			</div>
		</footer>
	);
}
