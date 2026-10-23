<script lang="ts">
	let { onRequestDemo = () => {} } = $props<{ onRequestDemo?: () => void }>();
</script>

<!-- Zenarate 1:1 Fullscreen Cinematic Hero Section (Screenshot 1) -->
<section class="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-900 select-none">
	<!-- Cinematic Background Image with Moody Warm Lighting -->
	<img
		src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=2070&auto=format&fit=crop"
		alt="Smart Parking & Urban Mobility - Line Parking"
		class="absolute inset-0 size-full object-cover object-[center_45%] scale-105 filter brightness-80 contrast-105"
	/>

	<!-- Subtle Dark Warm Vignette Overlay for Crisp Readability -->
	<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/50 backdrop-brightness-95"></div>

	<!-- Center Editorial Content -->
	<div class="relative z-10 mx-auto max-w-5xl px-4 text-center space-y-6 pt-16">
		
		<!-- 1. Zenarate Tag Pill: [ 🅿 SISTEM PARKIR CERDAS ] -->
		<div class="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/40 backdrop-blur-md px-4 py-1.5 text-[11px] font-mono tracking-widest text-white uppercase shadow-sm">
			<svg class="size-3.5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<rect width="18" height="18" x="3" y="3" rx="2" />
				<path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
			</svg>
			<span>SISTEM PARKIR CERDAS</span>
		</div>

		<!-- 2. Headline in Newsreader Editorial Serif -->
		<h1 class="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-[84px] text-white tracking-tight leading-[1.08] max-w-4xl mx-auto drop-shadow-md">
			Every parking experience, <span class="italic font-light">better</span> than the last.
		</h1>

		<!-- Subtitle for Parking Ecosystem -->
		<p class="text-sm sm:text-base text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
			Platform kinerja mobilitas terpadu yang menyatukan kecerdasan palang gerbang AI ANPR dengan akuntabilitas juru parkir mobile QRIS di lapangan.
		</p>

		<!-- 3. Zenarate Center Pill CTA -->
		<div class="pt-2">
			<button
				type="button"
				onclick={onRequestDemo}
				class="rounded-full border border-white/60 bg-black/40 backdrop-blur-md text-white px-8 py-3 text-xs font-semibold tracking-wide hover:bg-white hover:text-slate-950 transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
			>
				Get a Demo
			</button>
		</div>

	</div>
</section>
