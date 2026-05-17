export default function SlugLoading() {
	return (
		<main className="max-w-6xl mx-auto px-6 py-12 animate-pulse">
			<div className="flex items-center gap-2 mb-8">
				<div className="h-3 w-3 bg-zinc-100 rounded" />
				<div className="h-2.5 w-2 bg-zinc-100 rounded" />
				<div className="h-2.5 w-16 bg-zinc-100 rounded" />
				<div className="h-2.5 w-2 bg-zinc-100 rounded" />
				<div className="h-2.5 w-28 bg-zinc-100 rounded" />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
				<div className="aspect-3/4 bg-zinc-100 rounded-sm" />
				<div className="flex flex-col gap-4 pt-6">
					<div className="h-2.5 bg-zinc-100 rounded w-20" />
					<div className="h-8 bg-zinc-100 rounded w-3/4" />
					<div className="h-7 bg-zinc-100 rounded w-24 mt-2" />
					<div className="space-y-2 mt-6">
						<div className="h-3 bg-zinc-100 rounded" />
						<div className="h-3 bg-zinc-100 rounded" />
						<div className="h-3 bg-zinc-100 rounded w-4/5" />
					</div>
					<div className="h-12 bg-zinc-100 rounded-full w-48 mt-8" />
				</div>
			</div>
		</main>
	);
}
