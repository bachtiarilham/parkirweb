<script lang="ts">
	import * as Table from "$lib/components/ui/table/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import LogOutIcon from "@lucide/svelte/icons/log-out";
	import ShieldAlertIcon from "@lucide/svelte/icons/shield-alert";
	import { enhance } from "$app/forms";

	let { data } = $props();

	function formatDate(date: string) {
		return new Intl.DateTimeFormat("id-ID", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(new Date(date));
	}
</script>

<svelte:head>
	<title>Active Sessions - SvelteForge Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Active Sessions</h1>
			<p class="text-muted-foreground">Kelola sesi login pengguna dan perangkat terhubung.</p>
		</div>
	</div>

	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Pengguna</Table.Head>
					<Table.Head>Role</Table.Head>
					<Table.Head>Perangkat</Table.Head>
					<Table.Head>Tenant / Branch</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head>Terakhir Aktif</Table.Head>
					<Table.Head class="w-[100px]">Aksi</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.sessions as session (session.id)}
					<Table.Row>
						<Table.Cell class="font-medium">
							<div>
								<div class="font-semibold">{session.userName}</div>
								<div class="text-muted-foreground text-xs font-mono">UID: {session.userId}</div>
							</div>
						</Table.Cell>
						<Table.Cell>
							<Badge variant="default">{session.userRole}</Badge>
						</Table.Cell>
						<Table.Cell class="text-muted-foreground">{session.device}</Table.Cell>
						<Table.Cell class="text-muted-foreground">T: {session.tenantId} | B: {session.branchId}</Table.Cell>
						<Table.Cell>
							<Badge variant="secondary" class="text-emerald-600 bg-emerald-500/10">
								{session.status}
							</Badge>
						</Table.Cell>
						<Table.Cell class="text-muted-foreground">{formatDate(session.lastActive)}</Table.Cell>
						<Table.Cell>
							<form method="POST" action="?/revoke" use:enhance>
								<Button variant="destructive" size="sm" type="submit">
									<LogOutIcon class="mr-1.5 size-3.5" />
									Revoke
								</Button>
							</form>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
