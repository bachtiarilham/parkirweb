<script lang="ts">
	import ArrowLeftIcon from "@lucide/svelte/icons/arrow-left";
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
</script>

<!-- Zenarate 1:1 Customer Success Stories Carousel (Screenshot 5) -->
<section id="stories" class="py-24 bg-white text-slate-900 border-t border-slate-100 overflow-hidden">
	<div class="mx-auto max-w-[1400px] px-4 sm:px-8 space-y-10">
		
		<!-- Top Row: Editorial Headline + Carousel Controls -->
		<div class="text-center space-y-5">
			<h2 class="font-editorial text-4xl sm:text-6xl text-slate-900 tracking-tight leading-[1.12] max-w-3xl mx-auto">
				Success stories from the <span class="italic font-light">parking operations</span> teams.
			</h2>

			<div class="flex items-center justify-center gap-3 pt-2">
				<button
					type="button"
					class="rounded-full border border-slate-900 bg-white hover:bg-slate-900 hover:text-white px-6 py-2.5 text-xs font-semibold text-slate-900 transition cursor-pointer"
				>
					View Customer Stories
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

		<!-- Carousel Cards Track -->
		<div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch pt-6">
			
			<!-- Card 1: Left Operations Lead Portrait Card -->
			<div class="md:col-span-4 rounded-3xl overflow-hidden shadow-sm relative min-h-[420px] bg-slate-100">
				<img
					src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"
					alt="Kepala Operasional Parkir"
					class="size-full object-cover"
				/>
			</div>

			<!-- Card 2: Center Grand Pacific Lifestyle Story Card (Screenshot 5 1:1) -->
			<div class="md:col-span-5 rounded-3xl bg-slate-50 border border-slate-200/80 p-8 sm:p-12 flex flex-col justify-between shadow-xs">
				<div class="space-y-6">
					<!-- Brand Emblem -->
					<div class="flex items-center gap-2">
						<span class="text-sm font-black tracking-widest text-slate-900 uppercase">
							GRAND PACIFIC LIFESTYLE CENTER
						</span>
					</div>

					<!-- Industry Tag Pill -->
					<div>
						<span class="rounded-full bg-white border border-slate-200 px-3 py-1 text-[10px] font-mono tracking-widest text-slate-600 uppercase font-semibold">
							COMMERCIAL PROPERTY & MALL
						</span>
					</div>

					<!-- Story Summary Text -->
					<p class="text-base sm:text-lg text-slate-800 font-normal leading-relaxed">
						Bagaimana Grand Pacific Lifestyle Center mengintegrasikan sistem AI ANPR Line Parking, memangkas waktu antrean gerbang menjadi di bawah 0.8 detik, dan meningkatkan efisiensi operasional pendapatan parkir hingga 65%.
					</p>
				</div>

				<div class="pt-6">
					<a href="#stories" class="text-xs font-bold text-slate-900 hover:text-[#7862EA] inline-flex items-center gap-1.5 transition">
						<span>Pelajari selengkapnya</span>
						<span>→</span>
					</a>
				</div>
			</div>

			<!-- Card 3: Right Executive Portrait Card -->
			<div class="md:col-span-3 rounded-3xl overflow-hidden shadow-sm relative min-h-[420px] bg-slate-100">
				<img
					src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop"
					alt="Auditor PAD & Transportasi"
					class="size-full object-cover"
				/>
			</div>

		</div>

	</div>
</section>
