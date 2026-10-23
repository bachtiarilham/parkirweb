<script lang="ts">
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import SparklesIcon from "@lucide/svelte/icons/sparkles";

	let { onRequestDemo = () => {} } = $props<{
		onRequestDemo?: () => void;
	}>();
</script>

<!-- Zenarate Style Final CTA: High-Contrast Violet Gradient Card on Clean Canvas -->
<section class="py-20 bg-white text-slate-900">
	<div class="mx-auto max-w-6xl px-4 sm:px-8">
		
		<div class="rounded-3xl bg-gradient-to-br from-[#7862EA] via-[#6850E5] to-[#4F39CC] text-white p-10 sm:p-16 shadow-2xl shadow-[#7862EA]/30 text-center relative overflow-hidden">
			<!-- Subtle ambient circle -->
			<div class="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 blur-[60px] rounded-full pointer-events-none"></div>

			<div class="relative z-10 max-w-3xl mx-auto space-y-6">
				<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-bold">
					<SparklesIcon class="size-3.5" />
					<span>Uji Coba Langsung di Lokasi Anda</span>
				</div>

				<h2 class="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
					Ready to see Line Parking in action?
				</h2>

				<p class="text-base sm:text-lg text-white/90 font-normal max-w-2xl mx-auto leading-relaxed">
					Jadwalkan demonstrasi langsung bersama tim spesialis kami. Kami siap melakukan survei dan uji coba tanpa komitmen awal.
				</p>

				<div class="flex flex-wrap items-center justify-center gap-4 pt-4">
					<button
						type="button"
						onclick={onRequestDemo}
						class="rounded-full bg-white hover:bg-slate-100 active:scale-95 text-[#7862EA] px-8 py-4 text-sm font-black tracking-wide shadow-xl transition-all flex items-center gap-2 cursor-pointer"
					>
						<span>Get a Demo</span>
						<ArrowRightIcon class="size-4" />
					</button>

					<a
						href="/pricing"
						class="rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white px-7 py-4 text-sm font-bold transition-all flex items-center gap-2"
					>
						<span>Lihat Pilihan Paket</span>
					</a>
				</div>

				<p class="text-xs text-white/70 font-mono pt-2">
					✓ Tanpa biaya instalasi di muka • ✓ Kompatibel barrier gate eksisting • ✓ Standar QRIS BI
				</p>
			</div>

		</div>

	</div>
</section>
