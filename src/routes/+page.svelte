<script lang="ts">
	import ZenHeader from "$lib/components/landing/zen-header.svelte";
	import ZenHero from "$lib/components/landing/zen-hero.svelte";
	import ZenLogoCloud from "$lib/components/landing/zen-logo-cloud.svelte";
	import ZenPlatformIntro from "$lib/components/landing/zen-platform-intro.svelte";
	import ZenPillarPerform from "$lib/components/landing/zen-pillar-perform.svelte";
	import ZenStories from "$lib/components/landing/zen-stories.svelte";
	import ZenSummit from "$lib/components/landing/zen-summit.svelte";
	import ZenFaq from "$lib/components/landing/zen-faq.svelte";
	import ZenInsights from "$lib/components/landing/zen-insights.svelte";
	import ZenRoles from "$lib/components/landing/zen-roles.svelte";
	import ZenPrefooter from "$lib/components/landing/zen-prefooter.svelte";
	import ZenFooter from "$lib/components/landing/zen-footer.svelte";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";

	let { data } = $props();
	const user = $derived(data?.user ?? null);
	const isLoggedIn = $derived(Boolean(user));

	// State Modal Request Demo
	let isDemoModalOpen = $state(false);
	let demoName = $state("");
	let demoEmail = $state("");
	let demoCompany = $state("");
	let isDemoSubmitted = $state(false);

	function handleDemoSubmit(e: Event) {
		e.preventDefault();
		isDemoSubmitted = true;
	}

	function resetDemoForm() {
		demoName = "";
		demoEmail = "";
		demoCompany = "";
		isDemoSubmitted = false;
		isDemoModalOpen = false;
	}

	function openDemo() {
		isDemoSubmitted = false;
		isDemoModalOpen = true;
	}
</script>

<svelte:head>
	<title>Line Parking — Platform Mobilitas & Kinerja Parkir Cerdas</title>
	<meta
		name="description"
		content="Line Parking & LineSpot adalah platform kinerja dan mobilitas parkir cerdas terpadu untuk gerbang AI ANPR off-street dan juru parkir mobile on-street dari PT Line Utama Berkah."
	/>
</svelte:head>

<!-- Zenarate 1:1 Complete Canvas -->
<div class="flex min-h-screen w-full flex-col overflow-x-clip bg-white text-slate-900 font-sans antialiased selection:bg-[#7862EA] selection:text-white">
	
	<!-- 1. Floating Pill Navigation Header (Screenshots 1 & 2) -->
	<ZenHeader
		{isLoggedIn}
		{user}
		onRequestDemo={openDemo}
	/>

	<main class="grow">
		<!-- 2. Cinematic Hero Section (Screenshot 1) -->
		<ZenHero
			onRequestDemo={openDemo}
		/>

		<!-- 3. Scattered Logo Cloud (Screenshot 2) -->
		<ZenLogoCloud />

		<!-- 4. Platform Transition & Role Pills (Screenshot 3) -->
		<ZenPlatformIntro />

		<!-- 5. Core Pillar: Develop top-performing people (Screenshot 4) -->
		<ZenPillarPerform />

		<!-- 6. Customer Success Stories Carousel (Screenshot 5) -->
		<ZenStories />

		<!-- 7. Innovation Summit Event Banner (Screenshot 6) -->
		<ZenSummit />

		<!-- 8. Questions Answered FAQ (Screenshot 7) -->
		<ZenFaq />

		<!-- 9. Discover Our Insights (Screenshot 8) -->
		<ZenInsights />

		<!-- 10. Explore Roles and Industries (Screenshot 9) -->
		<ZenRoles />

		<!-- 11. Pre-Footer Motion Blur Banner (Screenshot 10) -->
		<ZenPrefooter
			onRequestDemo={openDemo}
		/>
	</main>

	<!-- 12. Grand Footer with World Clocks & Massive Wordmark (Screenshot 11) -->
	<ZenFooter />

</div>

<!-- ======================================================================
     ZENARATE 1:1 GET A DEMO MODAL
     ====================================================================== -->
<Dialog.Root bind:open={isDemoModalOpen}>
	<Dialog.Content class="max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 text-slate-900 shadow-2xl">
		<Dialog.Header class="space-y-1 text-left">
			<Dialog.Title class="font-editorial text-3xl font-bold text-slate-900">
				Jadwalkan Demo
			</Dialog.Title>
			<Dialog.Description class="text-xs text-slate-500">
				Konsultasikan implementasi palang gerbang AI ANPR atau sistem parkir tepi jalan QRIS bersama tim spesialis kami.
			</Dialog.Description>
		</Dialog.Header>

		{#if isDemoSubmitted}
			<div class="py-8 text-center space-y-4">
				<div class="size-14 rounded-full bg-slate-100 text-slate-900 border border-slate-200 flex items-center justify-center mx-auto">
					<CheckCircle2Icon class="size-7" />
				</div>
				<h3 class="text-xl font-bold text-slate-900">Permintaan Terkirim!</h3>
				<p class="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
					Terima kasih <strong>{demoName || "Bapak/Ibu"}</strong>. Tim konsultan Line Parking akan menghubungi <strong>{demoEmail}</strong> dalam 1x24 jam kerja.
				</p>
				<div class="pt-2">
					<button
						type="button"
						onclick={resetDemoForm}
						class="rounded-full bg-slate-900 px-7 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer shadow-sm"
					>
						Tutup
					</button>
				</div>
			</div>
		{:else}
			<form onsubmit={handleDemoSubmit} class="space-y-3.5 pt-3">
				<div class="space-y-1 text-left">
					<label for="f-name" class="text-xs font-bold text-slate-700">Nama Lengkap</label>
					<input
						id="f-name"
						type="text"
						required
						bind:value={demoName}
						placeholder="Budi Santoso"
						class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none transition"
					/>
				</div>

				<div class="space-y-1 text-left">
					<label for="f-email" class="text-xs font-bold text-slate-700">Email Instansi / Perusahaan</label>
					<input
						id="f-email"
						type="email"
						required
						bind:value={demoEmail}
						placeholder="budi@instansi.go.id"
						class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none transition"
					/>
				</div>

				<div class="space-y-1 text-left">
					<label for="f-org" class="text-xs font-bold text-slate-700">Nama Gedung / Dishub / Badan Usaha</label>
					<input
						id="f-org"
						type="text"
						required
						bind:value={demoCompany}
						placeholder="Grand Mall Surabaya / Dishub Kota"
						class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none transition"
					/>
				</div>

				<div class="pt-4 flex items-center justify-end gap-3">
					<button
						type="button"
						onclick={() => (isDemoModalOpen = false)}
						class="rounded-full px-4 py-2.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition"
					>
						Batal
					</button>
					<button
						type="submit"
						class="rounded-full bg-slate-900 hover:bg-slate-800 px-7 py-2.5 text-xs font-bold text-white transition-all cursor-pointer shadow-sm active:scale-95"
					>
						Kirim Jadwal Demo
					</button>
				</div>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>
