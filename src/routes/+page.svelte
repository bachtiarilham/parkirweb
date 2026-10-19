<script lang="ts">
	import Header from "$lib/components/landing/header.svelte";
	import BuildingScrollytelling from "$lib/components/landing/building-scrollytelling.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import Building2Icon from "@lucide/svelte/icons/building-2";
	import MapPinIcon from "@lucide/svelte/icons/map-pin";
	import SparklesIcon from "@lucide/svelte/icons/sparkles";

	let { data } = $props();
	const user = $derived(data?.user ?? null);
	const isLoggedIn = $derived(Boolean(user));

	// State Modal Request Demo
	let isDemoModalOpen = $state(false);
	let demoName = $state("");
	let demoEmail = $state("");
	let demoPhone = $state("");
	let demoOrg = $state("");
	let demoType = $state("both");
	let isDemoSubmitted = $state(false);

	function handleDemoSubmit(e: Event) {
		e.preventDefault();
		isDemoSubmitted = true;
	}

	function resetDemoForm() {
		demoName = "";
		demoEmail = "";
		demoPhone = "";
		demoOrg = "";
		demoType = "both";
		isDemoSubmitted = false;
		isDemoModalOpen = false;
	}

	function openDemoWithPrefill(type: "both" | "onstreet" | "offstreet") {
		demoType = type;
		isDemoSubmitted = false;
		isDemoModalOpen = true;
	}
</script>

<svelte:head>
	<title>PT Line Utama Berkah — Line Parking & LineSpot</title>
	<meta
		name="description"
		content="Solusi cerdas parkir on-street dan off-street Indonesia. Line Parking untuk otomatisasi gerbang gedung dan LineSpot untuk tata kelola parkir tepi jalan Pemda."
	/>
</svelte:head>

<div class="flex min-h-screen w-full flex-col overflow-x-clip bg-black text-white font-sans antialiased selection:bg-white selection:text-black">
	<!-- 1. Header Sticky Glassmorphism -->
	<Header
		{isLoggedIn}
		{user}
		onRequestDemo={() => openDemoWithPrefill("both")}
	/>

	<main class="grow">
		<!-- ======================================================================
		     2. 3D SCROLLYTELLING GEDUNG (KANAKNATURALS VIBE)
		     Hero -> On-Street -> Off-Street -> Ruang Server -> Operasional Gerbang
		     ====================================================================== -->
		<BuildingScrollytelling
			onRequestDemo={() => openDemoWithPrefill("both")}
		/>



		<!-- ======================================================================
		     4. SECTION FINAL CTA (Singkat & Jelas)
		     ====================================================================== -->
		<section class="py-24 px-4 sm:px-6 bg-black text-center border-t border-white/10">
			<div class="mx-auto max-w-2xl space-y-6">
				<h2 class="text-3xl sm:text-5xl font-bold text-white tracking-tight">
					Siap Uji Coba di Lokasi Anda?
				</h2>
				<p class="text-base text-zinc-400 font-light">
					Jadwalkan demonstrasi langsung bersama teknisi spesialis PT Line Utama Berkah.
				</p>
				<div class="pt-2 flex items-center justify-center gap-4">
					<button
						type="button"
						onclick={() => openDemoWithPrefill("both")}
						class="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black hover:bg-zinc-200 transition-all cursor-pointer shadow-xl"
					>
						Jadwalkan Demo Sekarang
					</button>
				</div>
			</div>
		</section>
	</main>

	<!-- Minimalist Footer -->
	<footer class="border-t border-white/10 bg-black py-10 px-4 sm:px-8">
		<div class="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
			<div class="flex items-center gap-3">
				<img
					src="/images/landing/lub.png"
					alt="PT Line Utama Berkah"
					width="112"
					height="28"
					loading="lazy"
					decoding="async"
					class="h-7 w-auto object-contain"
				/>
				<span class="font-mono">© 2026 PT Line Utama Berkah • Line Parking & LineSpot</span>
			</div>
			<div class="flex items-center gap-6">
				<a href="/privacy" class="hover:text-white transition-colors">Kebijakan Privasi</a>
				<a href="/terms" class="hover:text-white transition-colors">Syarat & Ketentuan</a>
				<span class="inline-flex items-center gap-1.5 font-mono text-emerald-400">
					<span class="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
					Sistem Operasional
				</span>
			</div>
		</div>
	</footer>
</div>

<!-- ======================================================================
     MODAL REQUEST DEMO (Simpel & Cepat)
     ====================================================================== -->
<Dialog.Root bind:open={isDemoModalOpen}>
	<Dialog.Content class="max-w-md rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 text-white shadow-2xl">
		<Dialog.Header class="space-y-1">
			<Dialog.Title class="text-xl font-bold text-white">
				Jadwalkan Demo Produk
			</Dialog.Title>
			<Dialog.Description class="text-xs text-zinc-400">
				Isi data singkat di bawah ini. Tim teknis kami akan menghubungi dalam 1x24 jam.
			</Dialog.Description>
		</Dialog.Header>

		{#if isDemoSubmitted}
			<div class="py-8 text-center space-y-4">
				<div class="size-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
					<CheckCircle2Icon class="size-6" />
				</div>
				<h3 class="text-lg font-bold text-white">Permintaan Terkirim!</h3>
				<p class="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
					Terima kasih, <strong>{demoName || "Bapak/Ibu"}</strong>. Tim PT Line Utama Berkah akan menghubungi melalui <strong>{demoPhone || demoEmail}</strong>.
				</p>
				<div class="pt-2">
					<button
						type="button"
						onclick={resetDemoForm}
						class="rounded-full bg-white px-6 py-2 text-xs font-bold text-black hover:bg-zinc-200"
					>
						Tutup
					</button>
				</div>
			</div>
		{:else}
			<form onsubmit={handleDemoSubmit} class="space-y-3.5 pt-3">
				<div class="space-y-1 text-left">
					<label for="f-name" class="text-[11px] font-mono text-zinc-400">Nama Lengkap</label>
					<input
						id="f-name"
						type="text"
						required
						bind:value={demoName}
						placeholder="e.g. Budi Santoso"
						class="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:border-white focus:outline-none"
					/>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1 text-left">
						<label for="f-email" class="text-[11px] font-mono text-zinc-400">Email Kerja</label>
						<input
							id="f-email"
							type="email"
							required
							bind:value={demoEmail}
							placeholder="budi@instansi.go.id"
							class="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:border-white focus:outline-none"
						/>
					</div>
					<div class="space-y-1 text-left">
						<label for="f-phone" class="text-[11px] font-mono text-zinc-400">No. WhatsApp</label>
						<input
							id="f-phone"
							type="tel"
							required
							bind:value={demoPhone}
							placeholder="0812xxxxxxx"
							class="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:border-white focus:outline-none"
						/>
					</div>
				</div>

				<div class="space-y-1 text-left">
					<label for="f-org" class="text-[11px] font-mono text-zinc-400">Instansi / Perusahaan</label>
					<input
						id="f-org"
						type="text"
						required
						bind:value={demoOrg}
						placeholder="Dishub Kab/Kota, Mall, Rumah Sakit, dll."
						class="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:border-white focus:outline-none"
					/>
				</div>

				<div class="space-y-1 text-left">
					<label for="f-type" class="text-[11px] font-mono text-zinc-400">Produk yang Diminati</label>
					<select
						id="f-type"
						bind:value={demoType}
						class="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-white focus:outline-none"
					>
						<option value="both">Keduanya (Line Parking & LineSpot)</option>
						<option value="onstreet">LineSpot (Parkir Tepi Jalan - Pemda/Dishub)</option>
						<option value="offstreet">Line Parking (Gerbang Gedung, Mall, RS)</option>
					</select>
				</div>

				<div class="pt-3 flex items-center justify-end gap-2.5">
					<button
						type="button"
						onclick={() => (isDemoModalOpen = false)}
						class="rounded-full px-4 py-2 text-xs text-zinc-400 hover:text-white"
					>
						Batal
					</button>
					<button
						type="submit"
						class="rounded-full bg-white px-6 py-2 text-xs font-bold text-black hover:bg-zinc-200 transition-all cursor-pointer shadow-md"
					>
						Kirim Permintaan
					</button>
				</div>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>
