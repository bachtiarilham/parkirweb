<script lang="ts">
	import * as Sheet from "$lib/components/ui/sheet/index.js";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import MenuIcon from "@lucide/svelte/icons/menu";
	import { page } from "$app/state";

	let {
		isLoggedIn = false,
		user = null,
		onRequestDemo = () => {},
	} = $props<{
		isLoggedIn?: boolean;
		user?: {
			fullName?: string;
			full_name?: string;
			name?: string;
			roleCode?: string | null;
		} | null;
		onRequestDemo?: () => void;
	}>();

	let mobileMenuOpen = $state(false);
	const currentPath = $derived(page.url.pathname);

	function scrollTo(id: string) {
		mobileMenuOpen = false;
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		} else {
			window.location.href = `/#${id}`;
		}
	}
</script>

<!-- Zenarate Floating Pill Header (1:1 Exact Match with Screenshots) -->
<header class="fixed top-5 inset-x-0 z-50 pointer-events-none px-4 sm:px-8">
	<div class="mx-auto max-w-[1400px] flex items-center justify-between">
		
		<!-- 1. Left Floating Navigation Pill -->
		<div class="pointer-events-auto rounded-full bg-white/95 backdrop-blur-md px-4 py-2 shadow-lg shadow-black/10 border border-slate-100 flex items-center gap-6">
			<!-- Zenarate Yellow Floral Loop Logo -->
			<a href="/" aria-label="Line Parking Beranda" class="flex items-center justify-center size-9 rounded-full bg-[#FACC15] text-slate-950 shadow-inner group transition-transform hover:scale-105">
				<svg class="size-5.5 text-slate-900 group-hover:rotate-45 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
					<circle cx="12" cy="12" r="7" />
					<circle cx="12" cy="5" r="1.5" fill="currentColor" />
					<circle cx="19" cy="12" r="1.5" fill="currentColor" />
					<circle cx="12" cy="19" r="1.5" fill="currentColor" />
					<circle cx="5" cy="12" r="1.5" fill="currentColor" />
				</svg>
			</a>

			<!-- Nav links with drop chevrons -->
			<nav class="hidden lg:flex items-center gap-6 text-[13px] font-medium text-slate-800 tracking-tight">
				<button type="button" onclick={() => scrollTo('pillars')} class="flex items-center gap-1 hover:text-slate-950 transition cursor-pointer">
					<span>Solusi</span>
					<ChevronDownIcon class="size-3 text-slate-500" />
				</button>
				<button type="button" onclick={() => scrollTo('pillars')} class="flex items-center gap-1 hover:text-slate-950 transition cursor-pointer">
					<span>Teknologi</span>
					<ChevronDownIcon class="size-3 text-slate-500" />
				</button>
				<a
					href="/pricing"
					class="transition cursor-pointer font-medium {currentPath.startsWith('/pricing') ? 'font-bold text-amber-600' : 'hover:text-slate-950 text-slate-800'}"
				>
					Pricing
				</a>
				<button type="button" onclick={() => scrollTo('insights')} class="flex items-center gap-1 hover:text-slate-950 transition cursor-pointer">
					<span>Wawasan</span>
					<ChevronDownIcon class="size-3 text-slate-500" />
				</button>
				<button type="button" onclick={() => scrollTo('stories')} class="hover:text-slate-950 transition cursor-pointer">
					Klien & Mitra
				</button>
				<button type="button" onclick={() => scrollTo('footer')} class="flex items-center gap-1 hover:text-slate-950 transition cursor-pointer">
					<span>Perusahaan</span>
					<ChevronDownIcon class="size-3 text-slate-500" />
				</button>
			</nav>

			<!-- Mobile Trigger -->
			<button
				type="button"
				onclick={() => (mobileMenuOpen = true)}
				class="lg:hidden p-1 text-slate-700 hover:text-slate-950"
			>
				<MenuIcon class="size-5" />
			</button>
		</div>

		<!-- 2. Right Floating Action Pills -->
		<div class="pointer-events-auto flex items-center gap-3">
			{#if isLoggedIn}
				<a
					href="/dashboard/member"
					class="rounded-full bg-white/95 backdrop-blur-md px-6 py-2.5 text-xs font-semibold text-slate-900 border border-slate-200 shadow-md shadow-black/5 hover:bg-slate-50 transition"
				>
					Dashboard
				</a>
			{:else}
				<a
					href="/login"
					class="rounded-full bg-white/95 backdrop-blur-md px-6 py-2.5 text-xs font-semibold text-slate-900 border border-slate-200 shadow-md shadow-black/5 hover:bg-slate-50 transition"
				>
					Sign In
				</a>
			{/if}

			<button
				type="button"
				onclick={onRequestDemo}
				class="rounded-full bg-white/95 backdrop-blur-md px-6 py-2.5 text-xs font-semibold text-slate-900 border border-slate-200 shadow-md shadow-black/5 hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
			>
				Get a Demo
			</button>
		</div>

	</div>
</header>

<!-- Mobile Sheet -->
<Sheet.Root bind:open={mobileMenuOpen}>
	<Sheet.Content side="top" class="bg-white text-slate-900 p-6 pt-20">
		<div class="space-y-4 text-center">
			<button type="button" onclick={() => scrollTo('pillars')} class="block w-full py-2 text-base font-semibold">Solusi</button>
			<button type="button" onclick={() => scrollTo('pillars')} class="block w-full py-2 text-base font-semibold">Teknologi</button>
			<a
				href="/pricing"
				onclick={() => (mobileMenuOpen = false)}
				class="block w-full py-2 text-base font-bold text-amber-600 hover:text-amber-700 transition"
			>
				Pricing & Paket
			</a>
			<button type="button" onclick={() => scrollTo('insights')} class="block w-full py-2 text-base font-semibold">Wawasan</button>
			<button type="button" onclick={() => scrollTo('stories')} class="block w-full py-2 text-base font-semibold">Klien & Mitra</button>
			<button type="button" onclick={() => scrollTo('footer')} class="block w-full py-2 text-base font-semibold">Perusahaan</button>
			<div class="pt-4 border-t border-slate-100 flex justify-center gap-3">
				{#if isLoggedIn}
					<a href="/dashboard/member" class="px-5 py-2 rounded-full bg-slate-900 text-white text-xs font-bold">Dashboard</a>
				{:else}
					<a href="/login" class="px-5 py-2 rounded-full border border-slate-300 text-xs font-bold">Sign In</a>
				{/if}
				<button type="button" onclick={() => { mobileMenuOpen = false; onRequestDemo(); }} class="px-5 py-2 rounded-full bg-[#FACC15] text-slate-950 text-xs font-bold shadow-sm">Get a Demo</button>
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>
