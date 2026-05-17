"use client";

import { useEffect } from "react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<main className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center">
			<p className="text-xs tracking-widest uppercase text-zinc-300 mb-4">
				Помилка
			</p>
			<h1 className="text-3xl font-semibold tracking-tight mb-3">
				Щось пішло не так
			</h1>
			<p className="text-sm text-zinc-400 mb-10 max-w-sm">
				Спробуйте оновити сторінку або поверніться пізніше.
			</p>
			<button
				type="button"
				onClick={reset}
				className="px-8 py-3 bg-zinc-900 text-white text-sm tracking-wide rounded-full hover:bg-zinc-700 transition-colors"
			>
				Спробувати знову
			</button>
		</main>
	);
}
