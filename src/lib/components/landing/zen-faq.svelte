<script lang="ts">
	import PlusIcon from "@lucide/svelte/icons/plus";
	import MinusIcon from "@lucide/svelte/icons/minus";

	let openIndex = $state<number | null>(null);

	const faqs = [
		{
			q: "Siapa saja yang menggunakan Line Parking & LineSpot?",
			a: "Line Parking digunakan oleh pengelola gedung perkantoran komersial, pusat perbelanjaan (mall), rumah sakit, pengelola residensial, hingga Dinas Perhubungan Pemda untuk pengelolaan parkir off-street palang gerbang dan on-street tepi jalan umum yang transparan."
		},
		{
			q: "Apakah sistem ini memerlukan penggantian total barrier gate lama?",
			a: "Tidak. Line Parking dirancang modular dan kompatibel dengan berbagai merek palang barrier gate existing (Wejoin, Magnetic, Barrier Pro, dll.) melalui modul Line IoT Gateway dan kamera cerdas Edge AI ANPR."
		},
		{
			q: "Bagaimana sistem menangani transaksi saat jaringan internet terputus (offline)?",
			a: "Sistem mengadopsi arsitektur Edge-Local Offline First. Barrier gate dan mobile POS juru parkir tetap beroperasi normal memproses kendaraan dan karcis secara offline, lalu melakukan sinkronisasi otomatis segera setelah internet pulih."
		},
		{
			q: "Berapa lama waktu implementasi dari survei lokasi hingga go-live?",
			a: "Untuk instalasi gerbang off-street komersial membutuhkan waktu 7 hingga 14 hari kerja termasuk kalibrasi sudut kamera ANPR. Untuk on-street juru parkir mobile dapat diaktifkan dalam hitungan 1-2 hari kerja."
		},
		{
			q: "Bagaimana jaminan keamanan setoran transaksi non-tunai (QRIS & Tap Uang Elektronik)?",
			a: "Setiap transaksi QRIS dinamis terhubung langsung ke rekening penampungan resmi atau Kas Daerah (RKUD) secara real-time dengan standar kepatuhan Bank Indonesia (BI QRIS & PCI-DSS)."
		},
		{
			q: "Apa perbedaan utama Line Parking dengan software parkir konvensional?",
			a: "Line Parking memadukan pengenalan plat AI ANPR berakurasi 99.4%, pencatatan jukir mobile, serta audit Command Center anti-fraud yang menjamin zero-leakage pendapatan tanpa karcis sobek manual."
		}
	];

	function toggle(idx: number) {
		openIndex = openIndex === idx ? null : idx;
	}
</script>

<!-- Zenarate 1:1 FAQ Accordion Section (Screenshot 7) -->
<section class="py-24 bg-white text-slate-900 border-t border-slate-100">
	<div class="mx-auto max-w-4xl px-4 sm:px-8 space-y-12">
		
		<!-- Editorial Headline -->
		<h2 class="font-editorial text-4xl sm:text-6xl text-slate-900 text-center tracking-tight leading-[1.12]">
			Your questions <span class="italic font-light">answered</span>.
		</h2>

		<!-- Clean Accordion List -->
		<div class="divide-y divide-slate-200 border-y border-slate-200">
			{#each faqs as item, idx}
				<div class="py-5">
					<button
						type="button"
						onclick={() => toggle(idx)}
						class="w-full flex items-center justify-between text-left group cursor-pointer"
					>
						<span class="text-base sm:text-lg font-medium text-slate-900 group-hover:text-slate-600 transition">
							{item.q}
						</span>
						<div class="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-200 transition shrink-0 ml-4">
							{#if openIndex === idx}
								<MinusIcon class="size-4" />
							{:else}
								<PlusIcon class="size-4" />
							{/if}
						</div>
					</button>

					{#if openIndex === idx}
						<div class="pt-3 pr-12 text-sm text-slate-600 leading-relaxed font-normal animate-in fade-in duration-200">
							{item.a}
						</div>
					{/if}
				</div>
			{/each}
		</div>

	</div>
</section>
