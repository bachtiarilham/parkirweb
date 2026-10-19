<script lang="ts">
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
	import * as Sheet from "$lib/components/ui/sheet/index.js";
	import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";
	import { buttonVariants } from "$lib/components/ui/button/button.svelte";
	import MenuIcon from "@lucide/svelte/icons/menu";
	import { cn } from "$lib/utils.js";

	const navItems: {
		title: string;
		href: string;
		sectionId?: string;
		onclick?: () => void;
	}[] = [
		{
			title: "On-Street",
			href: "#on-street",
			sectionId: "on-street",
			onclick: () => {
				scrollToSection("on-street");
			},
		},
		{
			title: "Off-Street",
			href: "#off-street",
			sectionId: "off-street",
			onclick: () => {
				scrollToSection("off-street");
			},
		},
		{
			title: "Technology",
			href: "#technology",
			sectionId: "technology",
			onclick: () => {
				scrollToSection("technology");
			},
		},
		{
			title: "Platform",
			href: "#platform",
			sectionId: "platform",
			onclick: () => {
				scrollToSection("platform");
			},
		},
		{
			title: "Pricing",
			href: "/pricing",
		},
	];

	let activeSection = $state<string>("hero-section");

	function scrollToSection(sectionId: string) {
		const stageMap: Record<string, number> = {
			"on-street": 1,
			"off-street": 2,
			"technology": 3,
			"platform": 3,
		};

		if (sectionId in stageMap && typeof window !== "undefined") {
			window.dispatchEvent(new CustomEvent("jump-building-stage", { detail: { stage: stageMap[sectionId] } }));
			return;
		}

		const section = document.getElementById(sectionId);
		if (section) {
			section.scrollIntoView({ behavior: "smooth" });
		}
	}

	$effect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
					}
				}
			},
			{
				threshold: 0.5,
			}
		);

		navItems.forEach((item) => {
			if (!item.sectionId) return;
			const el = document.getElementById(item.sectionId);
			if (el) observer.observe(el);
		});

		return () => observer.disconnect();
	});

	let mobileMenuOpen = $state<boolean>(false);
</script>

<NavigationMenu.Root viewport={false} class="hidden md:block">
	<NavigationMenu.List>
		{#each navItems as { title, href, sectionId, onclick }, i (i)}
			<NavigationMenu.Item>
				<NavigationMenu.Link active={activeSection === sectionId}>
					{#snippet child({ props })}
						<a
							{...props}
							{href}
							onclick={(e) => {
								if (!onclick) return;
								e.preventDefault();
								onclick();
							}}
							class={navigationMenuTriggerStyle({
								class: "bg-transparent not-[[data-active]]:!bg-transparent data-active:bg-secondary",
							})}>{title}</a
						>
					{/snippet}
				</NavigationMenu.Link>
			</NavigationMenu.Item>
		{/each}
	</NavigationMenu.List>
</NavigationMenu.Root>

<Sheet.Root bind:open={mobileMenuOpen}>
	<Sheet.Trigger
		class={buttonVariants({ variant: "outline", size: "icon", class: "md:hidden" })}
	>
		<MenuIcon />
	</Sheet.Trigger>
	<Sheet.Content side="right" class="overflow-y-scroll">
		<div class="mt-8 flex flex-col gap-1 p-4">
			{#each navItems as { title, href, sectionId, onclick }, i (i)}
				<a
					{href}
					onclick={(e) => {
						mobileMenuOpen = false;
						if (!onclick) return;
						e.preventDefault();
						setTimeout(() => {
							onclick();
						}, 500);
					}}
					class={cn(
						navigationMenuTriggerStyle({
							class: "w-full justify-start !bg-transparent",
						})
					)}
					class:!bg-secondary={activeSection === sectionId}>{title}</a
				>
			{/each}
		</div>
	</Sheet.Content>
</Sheet.Root>
