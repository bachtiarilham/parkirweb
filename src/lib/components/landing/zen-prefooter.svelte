<script lang="ts">
	let { onRequestDemo = () => {} } = $props<{ onRequestDemo?: () => void }>();
</script>

<!-- Zenarate 1:1 Pre-Footer Motion Blur Cinematic Banner (Screenshot 10) -->
<section class="relative min-h-[520px] sm:min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-slate-900 select-none">
	<!-- Cinematic Horizontal Motion Blur Background -->
	<img
		src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=2070&auto=format&fit=crop"
		alt="Motion Blur City Street - Zenarate style"
		class="absolute inset-0 size-full object-cover filter blur-[4px] brightness-90 contrast-110 scale-105"
	/>

	<!-- Overlay -->
	<div class="absolute inset-0 bg-black/25"></div>

	<!-- Center Editorial Headline & Dual Pill Buttons (Screenshot 10 1:1) -->
	<div class="relative z-10 mx-auto max-w-4xl px-4 text-center space-y-8">
		<h2 class="font-editorial text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-[1.12] drop-shadow-md">
			Let's make every parking experience <span class="italic font-light">better</span> than the last, <span class="italic font-light">together</span>.
		</h2>

		<!-- Dual Pill Controls -->
		<div class="flex flex-wrap items-center justify-center gap-3 pt-2">
			<button
				type="button"
				onclick={onRequestDemo}
				class="rounded-full bg-white/85 hover:bg-white backdrop-blur-md text-slate-900 border border-white/70 px-7 py-2.5 text-xs font-semibold shadow-md transition-all cursor-pointer"
			>
				Get a Demo
			</button>

			<a
				href="#pillars"
				class="rounded-full bg-white/85 hover:bg-white backdrop-blur-md text-slate-900 border border-white/70 px-7 py-2.5 text-xs font-semibold shadow-md transition-all"
			>
				Explore Solutions
			</a>
		</div>
	</div>
</section>
