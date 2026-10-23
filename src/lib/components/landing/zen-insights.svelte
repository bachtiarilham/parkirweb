<script lang="ts">
	import ArrowLeftIcon from "@lucide/svelte/icons/arrow-left";
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
</script>

<!-- Zenarate 1:1 Insights Carousel with Blurred Art Cards (Screenshot 8) -->
<section id="insights" class="py-24 bg-white text-slate-900 border-t border-slate-100 overflow-hidden">
	<div class="mx-auto max-w-[1400px] px-4 sm:px-8 space-y-10">
		
		<!-- Top Controls -->
		<div class="text-center space-y-5">
			<h2 class="font-editorial text-4xl sm:text-6xl text-slate-900 tracking-tight leading-[1.12]">
				Discover our <span class="italic font-light">insights</span>.
			</h2>

			<div class="flex items-center justify-center gap-3 pt-2">
				<button
					type="button"
					class="rounded-full border border-slate-900 bg-white hover:bg-slate-900 hover:text-white px-6 py-2 text-xs font-semibold text-slate-900 transition cursor-pointer"
				>
					View Insights
				</button>
				<button
					type="button"
					class="size-9 rounded-full border border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition cursor-pointer"
				>
					<ArrowLeftIcon class="size-4" />
				</button>
				<button
					type="button"
					class="size-9 rounded-full border border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition cursor-pointer"
				>
					<ArrowRightIcon class="size-4" />
				</button>
			</div>
		</div>

		<!-- 3 Large Blurred Art Cards (Screenshot 8 1:1) -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
			
			<!-- Card 1: Line Parking AI Vision -->
			<div class="space-y-4 group cursor-pointer">
				<div class="relative rounded-3xl aspect-square overflow-hidden bg-gradient-to-tr from-[#98A886] via-[#B8C8A6] to-[#D8E8C6] p-7 flex flex-col justify-between shadow-xs transition-transform duration-300 group-hover:scale-[1.02]">
					<!-- Motion Blur Image in BG -->
					<img
						src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
						alt="Line Parking AI Vision"
						class="absolute inset-0 size-full object-cover filter blur-[2px] opacity-75 mix-blend-multiply"
					/>
					
					<div class="relative z-10 flex items-center justify-between text-[10px] font-mono tracking-widest text-white/90 uppercase font-bold">
						<span>PENGUMUMAN RESMI</span>
						<span class="size-6 rounded-full border border-white/60 flex items-center justify-center text-xs">🅿</span>
					</div>

					<!-- Huge Editorial Watermark Typography -->
					<div class="relative z-10 font-editorial text-4xl sm:text-5xl text-white font-bold tracking-tight opacity-90">
						LineParking
					</div>
				</div>

				<div class="space-y-1">
					<div class="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">
						TEKNOLOGI AI
					</div>
					<h3 class="text-sm font-semibold text-slate-900 group-hover:text-slate-600 transition leading-snug">
						Standar Baru Otomatisasi Gerbang Bebas Karcis dengan Akurasi AI ANPR 99.4% untuk Mobilitas Bebas Hambatan
					</h3>
				</div>
			</div>

			<!-- Card 2: Summit 2027 -->
			<div class="space-y-4 group cursor-pointer">
				<div class="relative rounded-3xl aspect-square overflow-hidden bg-gradient-to-tr from-[#1E293B] via-[#2D3E50] to-[#E28E4A] p-7 flex flex-col justify-between shadow-xs transition-transform duration-300 group-hover:scale-[1.02]">
					<!-- Motion Blur Image in BG -->
					<img
						src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
						alt="Summit Architecture Art"
						class="absolute inset-0 size-full object-cover filter blur-[2px] opacity-70 mix-blend-screen"
					/>
					
					<div class="relative z-10 flex items-center justify-between text-[10px] font-mono tracking-widest text-white/90 uppercase font-bold">
						<span>28-29 April • Jakarta</span>
						<span class="size-6 rounded-full border border-white/60 flex items-center justify-center text-xs">☸</span>
					</div>

					<!-- Huge Editorial Watermark Typography -->
					<div class="relative z-10 font-editorial text-5xl sm:text-6xl text-white font-bold tracking-tight italic opacity-90">
						Summit
					</div>
				</div>

				<div class="space-y-1">
					<div class="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">
						EVENT & FORUM
					</div>
					<h3 class="text-sm font-semibold text-slate-900 group-hover:text-slate-600 transition leading-snug">
						2027 Indonesia Smart Parking & Urban Mobility Innovation Forum
					</h3>
				</div>
			</div>

			<!-- Card 3: LineSpot Street Parking PAD -->
			<div class="space-y-4 group cursor-pointer">
				<div class="relative rounded-3xl aspect-square overflow-hidden bg-gradient-to-tr from-[#606E57] via-[#85947A] to-[#A3B396] p-7 flex flex-col justify-between shadow-xs transition-transform duration-300 group-hover:scale-[1.02]">
					<!-- Motion Blur Image in BG -->
					<img
						src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
						alt="LineSpot Street Parking Art"
						class="absolute inset-0 size-full object-cover filter blur-[2px] opacity-75 mix-blend-multiply"
					/>
					
					<div class="relative z-10 flex items-center justify-between text-[10px] font-mono tracking-widest text-white/90 uppercase font-bold">
						<span>REGULASI & PAD</span>
						<span class="size-6 rounded-full border border-white/60 flex items-center justify-center text-xs">📱</span>
					</div>

					<!-- Huge Editorial Watermark Typography -->
					<div class="relative z-10 font-editorial text-5xl sm:text-6xl text-white font-bold tracking-tight opacity-90">
						LineSpot
					</div>
				</div>

				<div class="space-y-1">
					<div class="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">
						TATA KELOLA KEUANGAN
					</div>
					<h3 class="text-sm font-semibold text-slate-900 group-hover:text-slate-600 transition leading-snug">
						Mengapa Digitalisasi Jukir Tepi Jalan Menjadi Kunci Utama Optimalisasi PAD Bebas Kebocoran
					</h3>
				</div>
			</div>

		</div>

	</div>
</section>
