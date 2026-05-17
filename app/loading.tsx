function SkeletonCard() {
	return (
		<div className="animate-pulse">
			<div className="aspect-3/4 bg-zinc-100 rounded-sm" />
			<div className="mt-3 space-y-2">
				<div className="h-3 bg-zinc-100 rounded w-3/4" />
				<div className="h-3 bg-zinc-100 rounded w-1/3" />
			</div>
		</div>
	);
}

export default function HomeLoading() {
	return (
		<main className="max-w-6xl mx-auto px-6 py-12">
			<section className="mb-14 animate-pulse space-y-3">
				<div className="h-2.5 bg-zinc-100 rounded w-24" />
				<div className="h-9 bg-zinc-100 rounded w-56" />
				<div className="h-9 bg-zinc-100 rounded w-44" />
			</section>

			<div className="flex justify-between items-center border-b border-zinc-100 pb-6 mb-10 animate-pulse">
				<div className="flex gap-6">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="h-3 bg-zinc-100 rounded w-10" />
					))}
				</div>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
				{Array.from({ length: 8 }).map((_, i) => (
					<SkeletonCard key={i} />
				))}
			</div>
		</main>
	);
}
