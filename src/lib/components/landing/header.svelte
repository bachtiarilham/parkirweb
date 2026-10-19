<script lang="ts">
	import Nav from "$lib/components/landing/nav.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import LayoutDashboardIcon from "@lucide/svelte/icons/layout-dashboard";

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
			role_code?: string | null;
			role?: string | null;
		} | null;
		onRequestDemo?: () => void;
	}>();
</script>

<header
	class="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl transition-all duration-300"
>
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
		<!-- Left: Minimalist SVG wordmark / logo -->
		<a href="/" class="flex items-center gap-3 group focus:outline-none">
			<div class="relative flex items-center justify-center">
				<img
					src="/images/landing/lub.png"
					alt="PT Line Utama Berkah"
					width="144"
					height="36"
					decoding="async"
					class="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
				/>
			</div>
			<div class="hidden sm:flex flex-col items-start leading-none">
				<span class="text-xs font-semibold tracking-wider text-white uppercase font-sans">
					Line Berkah
				</span>
				<span class="text-[9px] font-mono tracking-widest text-[#86868b] uppercase">
					Smart Mobility
				</span>
			</div>
		</a>

		<!-- Center: Navigation Links -->
		<div class="hidden md:flex items-center justify-center">
			<Nav />
		</div>

		<!-- Right: Single High-Contrast Pill Button ("Request Demo") -->
		<div class="flex items-center gap-3">
			{#if isLoggedIn}
				<Button
					href="/dashboard/member"
					variant="ghost"
					size="sm"
					class="hidden sm:inline-flex rounded-full text-xs text-zinc-300 hover:text-white hover:bg-white/10 border border-white/10 gap-1.5"
				>
					<LayoutDashboardIcon class="size-3.5" />
					<span>Dashboard</span>
				</Button>
			{:else}
				<a
					href="/login"
					class="text-xs sm:text-sm font-medium text-zinc-300 hover:text-white px-3 py-1.5 transition-colors"
				>
					Login
				</a>
			{/if}

			<button
				type="button"
				onclick={() => onRequestDemo()}
				class="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs sm:text-sm font-semibold text-black transition-all duration-200 hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer"
			>
				Request Demo
			</button>
		</div>
	</div>
</header>
