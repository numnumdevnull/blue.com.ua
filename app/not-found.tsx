import Link from "next/link";

export default function NotFound() {
	return (
		<main className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center">
			<p className="text-xs tracking-widest uppercase text-zinc-300 mb-4">404</p>
			<h1 className="text-3xl font-semibold tracking-tight mb-3">
				Сторінку не знайдено
			</h1>
			<p className="text-sm text-zinc-400 mb-10 max-w-sm">
				Можливо, посилання застаріло або товар більше не доступний.
			</p>
			<Link
				href="/"
				className="px-8 py-3 bg-zinc-900 text-white text-sm tracking-wide rounded-full hover:bg-zinc-700 transition-colors"
			>
				На головну
			</Link>
		</main>
	);
}
