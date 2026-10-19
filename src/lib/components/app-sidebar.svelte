<script lang="ts">
	import LayoutDashboardIcon from "@lucide/svelte/icons/layout-dashboard";
	import UsersIcon from "@lucide/svelte/icons/users";
	import SettingsIcon from "@lucide/svelte/icons/settings";
	import BarChart3Icon from "@lucide/svelte/icons/bar-chart-3";
	import FileTextIcon from "@lucide/svelte/icons/file-text";
	import ShieldIcon from "@lucide/svelte/icons/shield";
	import BellIcon from "@lucide/svelte/icons/bell";
	import BookOpenIcon from "@lucide/svelte/icons/book-open";
	import CrownIcon from "@lucide/svelte/icons/crown";
	import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import LogOutIcon from "@lucide/svelte/icons/log-out";
	import UserIcon from "@lucide/svelte/icons/user";
	import BellRingIcon from "@lucide/svelte/icons/bell-ring";
	import LockIcon from "@lucide/svelte/icons/lock";
	import ZapIcon from "@lucide/svelte/icons/zap";
	import KeyboardIcon from "@lucide/svelte/icons/keyboard";
	import HelpCircleIcon from "@lucide/svelte/icons/help-circle";
	import CarIcon from "@lucide/svelte/icons/car";

	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";

	import { resolve } from "$app/paths";
	import { canAccessPage, type Role } from "$lib/rbac.js";

	type Props = {
		user: {
			name: string;
			email: string;
			role: string;
			role_code?: string | null;
		} | null;
		notificationCount?: number;
	};

	let { user, notificationCount = 0 }: Props = $props();

	const sidebar = Sidebar.useSidebar();

	// On mobile the sidebar is an overlay sheet; close it after navigating so it
	// doesn't stay open on top of the page the user just opened.
	function handleNavigate() {
		if (sidebar.isMobile) sidebar.setOpenMobile(false);
	}

	function getInitials(name: string) {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	}

	type NavItem = {
		title: string;
		url: string;
		icon: any;
		badge?: string;
		roles?: Role[];
	};

	type NavGroup = {
		label: string;
		items: NavItem[];
	};

	const navigation: NavGroup[] = $derived([
		{
			label: "Overview",
			items: [
				// { title: "Dashboard Utama", url: "/", icon: LayoutDashboardIcon },
				{ title: "Member Dashboard", url: "/dashboard/member", icon: CarIcon },
				{ title: "Tenant Dashboard", url: "/dashboard/tenant", icon: ShieldIcon },
				{ title: "Branch Dashboard", url: "/dashboard/branch", icon: UserIcon },
				{ title: "System Dashboard", url: "/dashboard/system", icon: CrownIcon },
				{ title: "Analytics", url: "/analytics", icon: BarChart3Icon },
			],
		},
		{
			label: "Identity & Access",
			items: [
				{ title: "Users", url: "/identity/users", icon: UsersIcon },
				{ title: "Tenants", url: "/identity/tenant", icon: ShieldIcon },
				{ title: "Branches", url: "/identity/branch", icon: UserIcon },
				{ title: "Barrier Gates", url: "/identity/gate", icon: LockIcon },
				{ title: "Active Sessions", url: "/identity/session", icon: ZapIcon },
			],
		},
		{
			label: "Parking Operations",
			items: [
				{ title: "Parking Sessions", url: "/parking/parking_session", icon: FileTextIcon },
				{ title: "Tariffs", url: "/parking/tariff", icon: SettingsIcon },
				{ title: "Slot Inventory", url: "/parking/inventory", icon: LayoutDashboardIcon },
				{ title: "Reservations", url: "/parking/reservation", icon: BookOpenIcon },
				{ title: "Work Shifts", url: "/parking/shift", icon: KeyboardIcon },
				{ title: "Officer Attendance", url: "/parking/officer_presence", icon: UserIcon },
				{ title: "Gate Alarms", url: "/parking/alarm", icon: BellIcon },
				{ title: "Promotions & Promo", url: "/parking/promo", icon: CrownIcon },
				{ title: "Ads Banner", url: "/ad", icon: ExternalLinkIcon },
			],
		},
		{
			label: "Financial & Reconciliation",
			items: [
				{ title: "Bank Reconciliation", url: "/financial/bank_reconciliation", icon: ShieldIcon },
				{ title: "Cashier Reconciliation", url: "/financial/cashier_reconciliation", icon: FileTextIcon },
				{ title: "Payment Orders", url: "/financial/order", icon: BarChart3Icon },
				{ title: "Transactions", url: "/financial/transactions", icon: ZapIcon },
				{ title: "Branch Balances", url: "/financial/branch_balances", icon: LayoutDashboardIcon },
				{ title: "Officer Balances", url: "/financial/officer_balances", icon: UserIcon },
				{ title: "Tenant Balances", url: "/financial/tenant_balances", icon: UsersIcon },
				{ title: "Tax Balances", url: "/financial/tax_balances", icon: FileTextIcon },
				{ title: "Platform Balances", url: "/financial/platform_balances", icon: CrownIcon },
			],
		},
		{
			label: "Membership",
			items: [
				{ title: "Rider Contracts", url: "/membership/rider_contract", icon: UserIcon },
				{ title: "Rider Plans", url: "/membership/rider_plan", icon: CrownIcon },
				{ title: "Tenant Contracts", url: "/membership/tenant_contract", icon: FileTextIcon },
				{ title: "Tenant Plans", url: "/membership/tenant_plan", icon: ShieldIcon },
			],
		},
		{
			label: "System",
			items: [
				{
					title: "Notifications",
					url: "/notifications",
					icon: BellIcon,
					badge: notificationCount > 0 ? String(notificationCount) : undefined,
				},
				{ title: "Settings", url: "/settings", icon: SettingsIcon },
			],
		},
	]);

	const currentUserRole = $derived((user?.role_code || user?.role || "").toUpperCase());

	const visibleNav = $derived(
		navigation
			.map((group) => ({
				...group,
				items: group.items.filter((item) => {
					// Jika item memiliki daftar roles spesifik:
					if (item.roles && item.roles.length > 0) {
						return item.roles.some((r) => r.toUpperCase() === currentUserRole);
					}
					// Gunakan pemeriksaan RBAC terpusat dari PAGE_ROLES
					return canAccessPage(item.url, currentUserRole);
				}),
			}))
			// Sembunyikan grup jika semua item di dalamnya tidak lolos filter
			.filter((group) => group.items.length > 0)
	);
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					{#snippet child({ props })}
						<a href={resolve("/")} {...props} onclick={handleNavigate}>
							<div
								class="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
							>
								<ZapIcon class="size-4" />
							</div>
							<div class="flex flex-col gap-0.5 leading-none">
								<span class="font-semibold">SvelteForge</span>
								<span class="text-xs">Admin Dashboard</span>
							</div>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>

	<Sidebar.Content>
   <!-- 1. Loop grup dari hasil filter visibleNav -->
		{#each visibleNav as group (group.label)}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{group.label}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						<!-- 2. Loop item dari group.items -->
                  {#each group.items as item (item.title)}
                     <Sidebar.MenuItem>
                        <Sidebar.MenuButton>
                           {#snippet child({ props })}
                              <a href={resolve(item.url as any)} {...props} onclick={handleNavigate}>
                                 <item.icon class="size-4" />
                                 <span>{item.title}</span>
                              </a>
                           {/snippet}
                        </Sidebar.MenuButton>
                        {#if item.badge}
                           <Sidebar.MenuBadge>{item.badge}</Sidebar.MenuBadge>
                        {/if}
                     </Sidebar.MenuItem>
                  {/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>

	<!-- Go Pro CTA -->
	<div class="px-3 py-2">
		<a
			href="https://dashboardpack.com/theme-details/svelteforge-premium/?utm_source=svelteforge&utm_medium=sidebar&utm_content=go-pro-card&utm_campaign=upgrade-svelteforge-premium"
			target="_blank"
			rel="noopener noreferrer"
			class="group flex items-center gap-2 rounded-lg border border-dashed border-amber-500/40 bg-amber-500/5 px-3 py-2.5 transition-all hover:border-amber-500 hover:bg-amber-500/10"
		>
			<CrownIcon class="size-4 text-amber-500" />
			<span class="flex-1 text-sm font-semibold">Go Pro</span>
			<Badge class="bg-amber-500 px-1.5 text-[10px] text-white hover:bg-amber-600">PRO</Badge>
			<ExternalLinkIcon
				class="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5"
			/>
		</a>
	</div>

	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton
								size="lg"
								class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								{...props}
							>
								<Avatar.Root class="size-8 rounded-lg">
									<Avatar.Fallback class="rounded-lg">{getInitials(user?.name || "User")}</Avatar.Fallback>
								</Avatar.Root>
								<div class="grid flex-1 text-left text-sm leading-tight">
									<span class="truncate font-semibold">{user?.name || "User"}</span>
									<span class="text-muted-foreground truncate text-xs">{user?.email || ""}</span>
								</div>
								<ChevronDownIcon class="ml-auto size-4" />
							</Sidebar.MenuButton>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56" align="end" side="top">
						<DropdownMenu.Label class="flex items-center gap-2">
							My Account
							<Badge variant="outline" class="text-xs capitalize">{user?.role || "Guest"}</Badge>
						</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item onclick={handleNavigate}>
							{#snippet child({ props })}
								<a href={resolve("/settings")} {...props}>
									<UserIcon class="mr-2 size-4" />
									Profile
								</a>
							{/snippet}
						</DropdownMenu.Item>
						<DropdownMenu.Item onclick={handleNavigate}>
							{#snippet child({ props })}
								<a href={resolve("/notifications")} {...props}>
									<BellRingIcon class="mr-2 size-4" />
									Notifications
									{#if notificationCount > 0}
										<Badge variant="secondary" class="ml-auto h-5 px-1.5 text-[10px]"
											>{notificationCount}</Badge
										>
									{/if}
								</a>
							{/snippet}
						</DropdownMenu.Item>
						<DropdownMenu.Item onclick={handleNavigate}>
							{#snippet child({ props })}
								<a href={resolve("/settings")} {...props}>
									<SettingsIcon class="mr-2 size-4" />
									Settings
								</a>
							{/snippet}
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item onclick={handleNavigate}>
							{#snippet child({ props })}
								<a href={resolve("/lock")} {...props}>
									<LockIcon class="mr-2 size-4" />
									Lock Screen
								</a>
							{/snippet}
						</DropdownMenu.Item>
						<DropdownMenu.Item onclick={handleNavigate}>
							{#snippet child({ props })}
								<a href={resolve("/settings")} {...props}>
									<KeyboardIcon class="mr-2 size-4" />
									Keyboard Shortcuts
								</a>
							{/snippet}
						</DropdownMenu.Item>
						<DropdownMenu.Item onclick={handleNavigate}>
							{#snippet child({ props })}
								<a href={resolve("/")} {...props}>
									<HelpCircleIcon class="mr-2 size-4" />
									Help & Support
								</a>
							{/snippet}
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item
							variant="destructive"
							onclick={() => {
								const form = document.getElementById("logout-form");
								if (form instanceof HTMLFormElement) form.requestSubmit();
							}}
						>
							<LogOutIcon class="mr-2 size-4" />
							Log out
						</DropdownMenu.Item>
					</DropdownMenu.Content>
					<form id="logout-form" method="POST" action="/logout" class="hidden"></form>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>

	<Sidebar.Rail />
</Sidebar.Root>
