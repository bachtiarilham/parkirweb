<script lang="ts">
	let activeTab = $state<'Automate' | 'Mobilize' | 'Govern'>('Automate');

	const tabData = {
		Automate: {
			title: "Automate barrier gates with edge AI",
			headline: "Otomatisasi palang gerbang tanpa antrean",
			desc: "Kamera AI ANPR berkecepatan tinggi mengenali plat nomor kendaraan dalam 0.3 detik dengan akurasi 99.4%, mendukung transaksi cashless, tap kartu, dan membership tanpa karcis fisik.",
			btnLabel: "Jelajahi Automate",
			color: "bg-[#5B7398]", // Slate-blue from Screenshot 4
			persona: "Gerbang: Kamera AI ANPR Masuk",
			scenario: "Akurasi Baca Plat 99.4% ⓘ",
			image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=1974&auto=format&fit=crop",
			speaker1Name: "Line Parking Edge Controller",
			speaker1Avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop",
			speaker1Msg: "Kamera mendeteksi kendaraan roda 4 plat B 1824 LUB. Status member aktif terverifikasi.",
			speaker2Name: "Gate Barrier Logic",
			speaker2Avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
			speaker2Msg: "Palang terbuka otomatis dalam 0.6 detik. Data check-in terekam di cloud pusat."
		},
		Mobilize: {
			title: "Develop top-performing parking teams",
			headline: "Tingkatkan integritas petugas parkir tepi jalan",
			desc: "Bekali juru parkir mobile dengan smart POS Android tangguh, QRIS dinamis resmi kas daerah, GPS geofencing titik jaga, dan pembukuan bebas karcis sobek.",
			btnLabel: "Jelajahi Mobilize",
			color: "bg-[#4B6B94]",
			persona: "Petugas: Juru Parkir Tepi Jalan",
			scenario: "Penagihan QRIS Dinamis ⓘ",
			image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
			speaker1Name: "Budi Santoso (Pengemudi)",
			speaker1Avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
			speaker1Msg: "Pak, saya bayar non-tunai pakai QRIS ya untuk motor plat B 4129 KAA.",
			speaker2Name: "Rahmat (Juru Parkir Resmi)",
			speaker2Avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
			speaker2Msg: "Siap Pak, ini QRIS resmi kas daerah. Struk digital tercetak dan setoran 100% langsung masuk."
		},
		Govern: {
			title: "Govern parking revenue with zero leakage",
			headline: "Audit pendapatan real-time tanpa kebocoran",
			desc: "Konsolidasikan transaksi dari puluhan barrier gate off-street dan ribuan titik parkir tepi jalan ke dalam dashboard Command Center eksekutif dan auditor PAD.",
			btnLabel: "Jelajahi Govern",
			color: "bg-[#3D5A80]",
			persona: "Auditor: Command Center PAD",
			scenario: "Rekonsiliasi Real-time ⓘ",
			image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1970&auto=format&fit=crop",
			speaker1Name: "Auditor Keuangan PAD",
			speaker1Avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
			speaker1Msg: "Tampilkan rekonsiliasi setoran parkir zona komersial hari ini hingga pukul 12:00 WIB.",
			speaker2Name: "Line Parking Command Core",
			speaker2Avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
			speaker2Msg: "Total 14.820 transaksi berhasil terekonsiliasi Rp 44.460.000 ke rekening resmi, variansi 0%."
		}
	};
</script>

<!-- Zenarate 1:1 Pillar Showcase: Slate-Blue Split Card + Big Serif Switcher (Screenshot 4) -->
<section id="pillars" class="py-24 bg-white text-slate-900">
	<div class="mx-auto max-w-7xl px-4 sm:px-8">
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
			
			<!-- Left Column: Big Slate-Blue Card with Embedded White Simulation Card -->
			<div class="lg:col-span-7">
				<div class="rounded-3xl {tabData[activeTab].color} p-6 sm:p-12 text-white shadow-2xl transition-colors duration-500">
					
					<!-- Card Headline in Editorial Serif -->
					<h3 class="font-editorial text-3xl sm:text-5xl text-white mb-8 tracking-tight">
						{#if activeTab === 'Automate'}
							Automate <span class="italic font-light">barrier gates</span> with edge AI
						{:else if activeTab === 'Mobilize'}
							Develop <span class="italic font-light">top-performing</span> parking teams
						{:else}
							Govern <span class="italic font-light">parking revenue</span> with zero leakage
						{/if}
					</h3>

					<!-- Inner White Simulation Container (Exact Match Screenshot 4) -->
					<div class="rounded-2xl bg-white p-4 sm:p-6 text-slate-900 shadow-xl space-y-4">
						
						<!-- Video / Scene Frame -->
						<div class="relative rounded-2xl overflow-hidden aspect-video sm:aspect-[16/9] bg-slate-100">
							<img
								src={tabData[activeTab].image}
								alt="Parking simulation scene"
								class="size-full object-cover object-center"
							/>

							<!-- Floating Badges in Video Frame -->
							<div class="absolute bottom-3 inset-x-4 flex items-center justify-between pointer-events-none">
								<span class="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-slate-800 shadow-sm">
									{tabData[activeTab].persona}
								</span>
								<span class="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-slate-800 shadow-sm flex items-center gap-1">
									{tabData[activeTab].scenario}
								</span>
							</div>
						</div>

						<!-- Chat Transcript Sim (Screenshot 4 1:1) -->
						<div class="space-y-3 pt-2">
							<!-- Bubble 1 -->
							<div class="flex items-start gap-3">
								<div class="size-8 rounded-full bg-slate-200 overflow-hidden shrink-0 mt-0.5">
									<img src={tabData[activeTab].speaker1Avatar} alt={tabData[activeTab].speaker1Name} class="size-full object-cover" />
								</div>
								<div class="bg-[#F0FDF4] border border-emerald-100 rounded-2xl rounded-tl-sm p-3.5 text-xs text-slate-800 shadow-xs max-w-md">
									<div class="font-bold text-slate-900 mb-0.5">{tabData[activeTab].speaker1Name}</div>
									<p class="leading-relaxed">{tabData[activeTab].speaker1Msg}</p>
								</div>
							</div>

							<!-- Bubble 2 -->
							<div class="flex items-start gap-3 justify-end">
								<div class="bg-slate-100 border border-slate-200 rounded-2xl rounded-tr-sm p-3.5 text-xs text-slate-800 shadow-xs max-w-md text-left">
									<div class="font-bold text-slate-900 mb-0.5">{tabData[activeTab].speaker2Name}</div>
									<p class="leading-relaxed">{tabData[activeTab].speaker2Msg}</p>
								</div>
								<div class="size-8 rounded-full bg-slate-300 overflow-hidden shrink-0 mt-0.5">
									<img src={tabData[activeTab].speaker2Avatar} alt={tabData[activeTab].speaker2Name} class="size-full object-cover" />
								</div>
							</div>
						</div>

					</div>

				</div>
			</div>

			<!-- Right Column: Massive Serif Switcher Tabs & Explanatory Text -->
			<div class="lg:col-span-5 space-y-6 text-left">
				
				<!-- Switcher Tabs: Automate, Mobilize, Govern -->
				<div class="flex flex-col space-y-3">
					<button
						type="button"
						onclick={() => (activeTab = 'Automate')}
						class="text-left font-editorial text-4xl sm:text-5xl transition-all cursor-pointer flex items-center gap-3 {activeTab === 'Automate' ? 'italic font-bold text-slate-900' : 'font-light text-slate-300 hover:text-slate-500'}"
					>
						{#if activeTab === 'Automate'}
							<span class="text-[#7862EA] text-3xl font-sans">•</span>
						{/if}
						<span>Automate</span>
					</button>

					<button
						type="button"
						onclick={() => (activeTab = 'Mobilize')}
						class="text-left font-editorial text-4xl sm:text-5xl transition-all cursor-pointer flex items-center gap-3 {activeTab === 'Mobilize' ? 'italic font-bold text-slate-900' : 'font-light text-slate-300 hover:text-slate-500'}"
					>
						{#if activeTab === 'Mobilize'}
							<span class="text-[#7862EA] text-3xl font-sans">•</span>
						{/if}
						<span>Mobilize</span>
					</button>

					<button
						type="button"
						onclick={() => (activeTab = 'Govern')}
						class="text-left font-editorial text-4xl sm:text-5xl transition-all cursor-pointer flex items-center gap-3 {activeTab === 'Govern' ? 'italic font-bold text-slate-900' : 'font-light text-slate-300 hover:text-slate-500'}"
					>
						{#if activeTab === 'Govern'}
							<span class="text-[#7862EA] text-3xl font-sans">•</span>
						{/if}
						<span>Govern</span>
					</button>
				</div>

				<!-- Description -->
				<p class="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-md pt-2">
					{tabData[activeTab].desc}
				</p>

				<!-- Pill Button with Black Border -->
				<div class="pt-4">
					<button
						type="button"
						class="rounded-full border border-slate-900 bg-white hover:bg-slate-900 hover:text-white px-7 py-3 text-xs font-semibold text-slate-900 transition-all cursor-pointer"
					>
						{tabData[activeTab].btnLabel}
					</button>
				</div>

			</div>

		</div>
	</div>
</section>
