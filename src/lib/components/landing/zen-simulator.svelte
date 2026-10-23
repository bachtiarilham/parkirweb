<script lang="ts">
	import PlayIcon from "@lucide/svelte/icons/play";
	import RotateCcwIcon from "@lucide/svelte/icons/rotate-ccw";
	import CheckCircleIcon from "@lucide/svelte/icons/check-circle";
	import CameraIcon from "@lucide/svelte/icons/camera";
	import SmartphoneIcon from "@lucide/svelte/icons/smartphone";
	import SparklesIcon from "@lucide/svelte/icons/sparkles";

	let activeSimTab = $state<'gate' | 'jukir'>('gate');

	// State for Gate Simulation
	let gateState = $state<'IDLE' | 'SCANNING' | 'OPENED'>('IDLE');
	let scannedPlate = $state('B 1824 LUB');

	function triggerGateSim() {
		if (gateState !== 'IDLE') return;
		gateState = 'SCANNING';
		setTimeout(() => {
			gateState = 'OPENED';
		}, 800);
	}

	function resetGateSim() {
		gateState = 'IDLE';
	}

	// State for Jukir POS Simulation
	let jukirVehicle = $state<'MOTOR' | 'MOBIL'>('MOTOR');
	let jukirPaymentStatus = $state<'PENDING' | 'PAID'>('PENDING');

	function payJukirSim() {
		jukirPaymentStatus = 'PAID';
	}

	function resetJukirSim() {
		jukirPaymentStatus = 'PENDING';
	}
</script>

<!-- Zenarate Style Interactive Sandbox: Clean White Container, Subtle Shadows, Real-time Feedback -->
<section id="simulator" class="py-24 bg-slate-50 text-slate-900 border-b border-slate-200">
	<div class="mx-auto max-w-7xl px-4 sm:px-8">
		
		<!-- Header -->
		<div class="text-center max-w-3xl mx-auto space-y-4 mb-14">
			<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F3F0FF] border border-[#7862EA]/20 text-[#7862EA] text-xs font-bold">
				<SparklesIcon class="size-3.5 text-[#7862EA]" />
				<span>Interactive Product Sandbox (Show, Don't Tell)</span>
			</div>
			<h2 class="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
				Coba Langsung Simulasi Alur Kerja Line Parking
			</h2>
			<p class="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
				Lihat bagaimana kecerdasan buatan membaca plat kendaraan dalam 0.7 detik dan bagaimana aplikasi POS Jukir menertibkan setoran tanpa celah.
			</p>
		</div>

		<!-- Simulator Outer Container -->
		<div class="max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/60 p-6 sm:p-10">
			
			<!-- Mode Selector -->
			<div class="flex flex-wrap items-center justify-center gap-3 mb-8 border-b border-slate-100 pb-6">
				<button
					type="button"
					onclick={() => (activeSimTab = 'gate')}
					class="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer {activeSimTab === 'gate' ? 'bg-[#7862EA] text-white shadow-md shadow-[#7862EA]/20' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}"
				>
					<CameraIcon class="size-4" />
					<span>1. Simulasi Gerbang ANPR AI</span>
				</button>

				<button
					type="button"
					onclick={() => (activeSimTab = 'jukir')}
					class="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer {activeSimTab === 'jukir' ? 'bg-[#7862EA] text-white shadow-md shadow-[#7862EA]/20' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}"
				>
					<SmartphoneIcon class="size-4" />
					<span>2. Simulasi Jukir Mobile POS</span>
				</button>
			</div>

			<!-- TAB 1: SIMULATOR GERBANG ANPR -->
			{#if activeSimTab === 'gate'}
				<div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
					
					<!-- Simulated Camera Terminal Canvas -->
					<div class="md:col-span-7 rounded-2xl bg-slate-950 p-6 aspect-video flex flex-col justify-between text-white relative shadow-inner">
						<div class="flex items-center justify-between text-xs font-mono">
							<span class="flex items-center gap-1.5 text-emerald-400 font-bold">
								<span class="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
								CAM-01 [GATE INBOUND]
							</span>
							<span class="text-slate-400">Status: {gateState}</span>
						</div>

						<div class="text-center my-auto space-y-2">
							{#if gateState === 'IDLE'}
								<div class="text-slate-400 text-xs font-mono">
									[Klik tombol "Simulasikan Mobil Datang" di samping]
								</div>
							{:else if gateState === 'SCANNING'}
								<div class="p-4 rounded-xl bg-[#7862EA]/25 border border-[#7862EA] text-center space-y-1 animate-pulse">
									<div class="text-[10px] font-mono text-[#A594FD] uppercase tracking-wider">
										AI Optical Character Recognition...
									</div>
									<div class="text-2xl font-black text-white font-mono">MEMINDAI PLAT NOMOR...</div>
								</div>
							{:else if gateState === 'OPENED'}
								<div class="p-4 rounded-xl bg-emerald-500/20 border border-emerald-400 text-center space-y-1">
									<div class="text-[10px] font-mono text-emerald-300 uppercase tracking-wider">
										✓ Plat Terverifikasi (99.4% Match)
									</div>
									<div class="text-3xl font-black text-white font-mono tracking-widest bg-black/40 py-1 rounded-lg">
										{scannedPlate}
									</div>
									<div class="text-xs font-bold text-emerald-400 pt-1">
										PALANG TERBUKA [Waktu: 0.72 detik]
									</div>
								</div>
							{/if}
						</div>

						<div class="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-2">
							<span>Relay Palang: {gateState === 'OPENED' ? 'OPEN' : 'CLOSED'}</span>
							<span>Tiket: {gateState === 'OPENED' ? '#TK-882910' : '-'}</span>
						</div>
					</div>

					<!-- Controls & Explanation -->
					<div class="md:col-span-5 space-y-4 text-left">
						<h3 class="text-xl font-bold text-slate-900">
							Otomatisasi Penuh Tanpa Karcis Kertas
						</h3>
						<p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
							Kamera AI membaca plat nopol dalam sekejap saat kendaraan mendekat. Palang membuka otomatis tanpa pengemudi harus membuka jendela kaca.
						</p>

						<div class="pt-2">
							{#if gateState === 'IDLE'}
								<button
									type="button"
									onclick={triggerGateSim}
									class="w-full py-3.5 px-4 rounded-full bg-[#7862EA] hover:bg-[#6850E5] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#7862EA]/20 transition flex items-center justify-center gap-2 cursor-pointer"
								>
									<PlayIcon class="size-4" />
									<span>Simulasikan Mobil Tiba di Gerbang</span>
								</button>
							{:else if gateState === 'SCANNING'}
								<button
									type="button"
									disabled
									class="w-full py-3.5 px-4 rounded-full bg-slate-200 text-slate-500 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-not-allowed"
								>
									<span class="size-3.5 border-2 border-slate-400 border-t-slate-700 rounded-full animate-spin"></span>
									<span>AI Memindai Plat...</span>
								</button>
							{:else}
								<button
									type="button"
									onclick={resetGateSim}
									class="w-full py-3.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer"
								>
									<RotateCcwIcon class="size-4 text-[#7862EA]" />
									<span>Reset & Coba Simulasi Lagi</span>
								</button>
							{/if}
						</div>
					</div>

				</div>
			{/if}

			<!-- TAB 2: SIMULATOR JUKIR ON-STREET -->
			{#if activeSimTab === 'jukir'}
				<div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
					
					<!-- POS Screen Simulation -->
					<div class="md:col-span-6 rounded-2xl bg-slate-50 border border-slate-200 p-6 space-y-4">
						<div class="flex items-center justify-between border-b border-slate-200 pb-3">
							<span class="text-xs font-bold text-slate-900">LineSpot POS Mobile v4.2</span>
							<span class="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
								● Shift Jukir Aktif
							</span>
						</div>

						<div class="space-y-2">
							<div class="text-[10px] text-slate-500 font-mono">PILIH KENDARAAN:</div>
							<div class="grid grid-cols-2 gap-2">
								<button
									type="button"
									onclick={() => (jukirVehicle = 'MOTOR')}
									class="py-2 rounded-xl text-xs font-bold border transition cursor-pointer {jukirVehicle === 'MOTOR' ? 'bg-[#7862EA] text-white border-[#7862EA]' : 'bg-white border-slate-200 text-slate-700'}"
								>
									Motor (Rp 2.000)
								</button>
								<button
									type="button"
									onclick={() => (jukirVehicle = 'MOBIL')}
									class="py-2 rounded-xl text-xs font-bold border transition cursor-pointer {jukirVehicle === 'MOBIL' ? 'bg-[#7862EA] text-white border-[#7862EA]' : 'bg-white border-slate-200 text-slate-700'}"
								>
									Mobil (Rp 4.000)
								</button>
							</div>
						</div>

						<div class="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-2 shadow-xs">
							<div class="text-xs text-slate-500">Tarif Parkir:</div>
							<div class="text-3xl font-black text-slate-900 font-mono">
								{jukirVehicle === 'MOTOR' ? 'Rp 2.000' : 'Rp 4.000'}
							</div>

							{#if jukirPaymentStatus === 'PENDING'}
								<div class="pt-2">
									<button
										type="button"
										onclick={payJukirSim}
										class="w-full py-2.5 rounded-full bg-[#7862EA] hover:bg-[#6850E5] text-white text-xs font-bold shadow-md shadow-[#7862EA]/20 transition cursor-pointer"
									>
										Bayar via QRIS Dinamis
									</button>
								</div>
							{:else}
								<div class="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5">
									<CheckCircleIcon class="size-4" />
									<span>Pembayaran Lunas! Struk Diterbitkan.</span>
								</div>
								<button
									type="button"
									onclick={resetJukirSim}
									class="text-[11px] text-slate-500 hover:text-slate-800 underline block mx-auto pt-1"
								>
									Reset Tiket Baru
								</button>
							{/if}
						</div>
					</div>

					<!-- Explanation -->
					<div class="md:col-span-6 space-y-4 text-left">
						<h3 class="text-xl font-bold text-slate-900">
							Tata Kelola Parkir Tepi Jalan Modern
						</h3>
						<p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
							Juru parkir hanya perlu menekan 2 kali klik di ponsel untuk menerbitkan struk dan menampilkan QRIS. Pembayaran langsung masuk ke rekening kas daerah secara transparan.
						</p>
						<div class="p-4 rounded-2xl bg-slate-100 text-xs text-slate-700 font-medium leading-relaxed">
							💡 <strong>Resiliensi Tanpa Sinyal:</strong> Jika juru parkir berada di area blank spot internet, transaksi tetap tersimpan dengan enkripsi lokal dan otomatis di-push ke server saat sinyal pulih.
						</div>
					</div>

				</div>
			{/if}

		</div>

	</div>
</section>
