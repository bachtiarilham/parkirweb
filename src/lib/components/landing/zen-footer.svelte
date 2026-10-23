<script lang="ts">
	let email = $state('');
	let submitted = $state(false);

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (email) submitted = true;
	}
</script>

<!-- Zenarate 1:1 Grand Footer (Screenshot 11) -->
<footer id="footer" class="relative -mt-10 rounded-t-[40px] bg-white pt-16 pb-6 px-4 sm:px-12 border-t border-slate-200 text-slate-900 overflow-hidden select-none z-20">
	<div class="mx-auto max-w-[1400px] space-y-16">
		
		<!-- Main Content Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
			
			<!-- Left Column: Icon + Headline + Pill Email Input -->
			<div class="lg:col-span-5 space-y-8">
				
				<!-- Zenarate Floral Loop Symbol -->
				<div class="size-9 rounded-full border border-slate-900 flex items-center justify-center">
					<svg class="size-5 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="7" />
						<circle cx="12" cy="5" r="1.5" fill="currentColor" />
						<circle cx="19" cy="12" r="1.5" fill="currentColor" />
						<circle cx="12" cy="19" r="1.5" fill="currentColor" />
						<circle cx="5" cy="12" r="1.5" fill="currentColor" />
					</svg>
				</div>

				<!-- Headline -->
				<h3 class="font-editorial text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight max-w-sm">
					Close the <span class="italic font-light">loop</span> in frontline parking operations
				</h3>

				<!-- Email Pill Input + Submit Pill Button -->
				<form onsubmit={handleSubmit} class="flex items-center gap-2 max-w-sm">
					<input
						type="email"
						required
						bind:value={email}
						placeholder="Email address"
						class="flex-1 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none transition"
					/>
					<button
						type="submit"
						class="rounded-full border border-slate-900 bg-white hover:bg-slate-900 hover:text-white px-6 py-2.5 text-xs font-semibold text-slate-900 transition cursor-pointer"
					>
						{submitted ? 'Sent' : 'Submit'}
					</button>
				</form>
			</div>

			<!-- Right Column: World Clocks + 4 Navigation Columns -->
			<div class="lg:col-span-7 space-y-12">
				
				<!-- World Clocks Row (Screenshot 11 1:1) -->
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-6 text-[10px] font-mono tracking-widest uppercase text-slate-500 pb-8 border-b border-slate-100">
					<div>
						<div class="text-slate-400">JAKARTA, WIB</div>
						<div class="text-xs font-bold text-slate-800 mt-1">01:10 PM</div>
					</div>
					<div>
						<div class="text-slate-400">SURABAYA, WIB</div>
						<div class="text-xs font-bold text-slate-800 mt-1">01:10 PM</div>
					</div>
					<div>
						<div class="text-slate-400">MAKASSAR, WITA</div>
						<div class="text-xs font-bold text-slate-800 mt-1">02:10 PM</div>
					</div>
					<div>
						<div class="text-slate-400">JAYAPURA, WIT</div>
						<div class="text-xs font-bold text-slate-800 mt-1">03:10 PM</div>
					</div>
				</div>

				<!-- 4 Links Columns -->
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs">
					<!-- Col 1: Solusi -->
					<div class="space-y-3">
						<div class="font-bold text-slate-900">Solusi</div>
						<ul class="space-y-2 text-slate-600">
							<li><a href="#pillars" class="hover:text-slate-900 transition">Off-Street Gate AI</a></li>
							<li><a href="#pillars" class="hover:text-slate-900 transition">LineSpot Street POS</a></li>
							<li><a href="#pillars" class="hover:text-slate-900 transition">Command Center PAD</a></li>
						</ul>
					</div>

					<!-- Col 2: Wawasan -->
					<div class="space-y-3">
						<div class="font-bold text-slate-900">Wawasan</div>
						<ul class="space-y-2 text-slate-600">
							<li><a href="#insights" class="hover:text-slate-900 transition">Wawasan Parkir</a></li>
							<li><a href="#stories" class="hover:text-slate-900 transition">Studi Kasus</a></li>
							<li><a href="#stories" class="hover:text-slate-900 transition">Regulasi & PAD</a></li>
							<li><a href="#stories" class="hover:text-slate-900 transition">Mobility Summit</a></li>
						</ul>
					</div>

					<!-- Col 3: Perusahaan -->
					<div class="space-y-3">
						<div class="font-bold text-slate-900">Perusahaan</div>
						<ul class="space-y-2 text-slate-600">
							<li><a href="#footer" class="hover:text-slate-900 transition">PT Line Utama Berkah</a></li>
							<li><a href="#footer" class="hover:text-slate-900 transition">Hubungi Kami</a></li>
							<li><a href="#footer" class="hover:text-slate-900 transition">Karir</a></li>
							<li><a href="#footer" class="hover:text-slate-900 transition">Syarat & Ketentuan</a></li>
						</ul>
					</div>

					<!-- Col 4: Integrasi -->
					<div class="space-y-3">
						<div class="font-bold text-slate-900">Integrasi</div>
						<ul class="space-y-2 text-slate-600">
							<li><a href="#logos" class="hover:text-slate-900 transition">BCA & Mandiri QRIS</a></li>
							<li><a href="#logos" class="hover:text-slate-900 transition">DISHUB Pemda</a></li>
							<li><a href="#logos" class="hover:text-slate-900 transition">REST API Gateway</a></li>
						</ul>
					</div>
				</div>

			</div>

		</div>

		<!-- Bottom Massive Watermark Wordmark (Screenshot 11 1:1) -->
		<div class="pt-12 sm:pt-20 pb-4 text-center overflow-hidden">
			<div class="font-editorial text-[14vw] sm:text-[15vw] font-bold text-slate-900 tracking-tighter leading-none select-none opacity-95 whitespace-nowrap">
				Line Parking
			</div>
		</div>

	</div>
</footer>
