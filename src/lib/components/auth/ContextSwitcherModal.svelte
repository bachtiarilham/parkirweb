<script lang="ts">
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import BuildingIcon from '@lucide/svelte/icons/building-2';
	import CheckIcon from '@lucide/svelte/icons/check';
	import XIcon from '@lucide/svelte/icons/x';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import type { AccessibleScope } from '$lib/types/identity/session.dto.js';

	let {
		isOpen = $bindable(false),
		currentBranchId = null,
		currentRole = ''
	}: {
		isOpen: boolean;
		currentBranchId?: string | number | null;
		currentRole?: string | null;
	} = $props();

	let scopes = $state<AccessibleScope[]>([]);
	let isLoading = $state(false);
	let isSwitching = $state(false);
	let errorMessage = $state('');

	$effect(() => {
		if (isOpen) {
			loadScopes();
		}
	});

	async function loadScopes() {
		isLoading = true;
		errorMessage = '';
		try {
			const res = await fetch('/api/auth/scopes');
			const json = await res.json();
			if (json.success && Array.isArray(json.data)) {
				scopes = json.data;
			} else {
				errorMessage = json.message || 'Gagal memuat ruang kerja';
			}
		} catch (e: any) {
			errorMessage = e.message || 'Terjadi kesalahan jaringan';
		} finally {
			isLoading = false;
		}
	}

	async function handleSwitch(scopeId: number) {
		isSwitching = true;
		errorMessage = '';
		try {
			const res = await fetch('/api/auth/switch-scope', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ scopeId })
			});
			const json = await res.json();
			if (json.success) {
				// Arahkan langsung ke dashboard tujuan peran yang baru
				if (json.data?.targetUrl) {
					window.location.href = json.data.targetUrl;
				} else {
					window.location.reload();
				}
			} else {
				errorMessage = json.message || 'Gagal beralih cabang';
				isSwitching = false;
			}
		} catch (e: any) {
			errorMessage = e.message || 'Terjadi kesalahan jaringan';
			isSwitching = false;
		}
	}

	function getRoleLabel(role: string): string {
		const r = role.toUpperCase();
		if (r === 'ADMIN-SYSTEM') return 'Admin Sistem';
		if (r === 'ADMIN-TENANT') return 'Admin Tenant';
		if (r === 'ADMIN-BRANCH') return 'Admin Cabang';
		if (r === 'OFFICER') return 'Petugas Jukir';
		if (r === 'CUSTOMER') return 'Customer';
		return role;
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
		<div class="w-full max-w-sm">
			<LiquidGlassCard variant="dark" class="p-5 border border-[#00B4D8]/40 shadow-2xl">
				<!-- Header Modal -->
				<div class="flex items-center justify-between pb-3 border-b border-white/10">
					<div>
						<h3 class="text-sm font-extrabold text-white">Ganti Ruang Kerja</h3>
						<p class="text-[11px] text-[#90E0EF]/70">Pilih cabang tugas Anda</p>
					</div>
					<button
						type="button"
						onclick={() => (isOpen = false)}
						class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
					>
						<XIcon class="w-4 h-4" />
					</button>
				</div>

				{#if errorMessage}
					<div class="mt-3 p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-[11px] text-rose-200">
						⚠️ {errorMessage}
					</div>
				{/if}

				<!-- List Scopes -->
				<div class="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
					{#if isLoading}
						<div class="py-6 flex flex-col items-center justify-center gap-2 text-xs text-[#90E0EF]/60">
							<RefreshCwIcon class="w-5 h-5 animate-spin text-[#00B4D8]" />
							<span>Memuat ruang kerja...</span>
						</div>
					{:else if scopes.length === 0}
						<div class="py-6 text-center text-xs text-[#90E0EF]/60">
							Tidak ada ruang kerja lain yang terhubung.
						</div>
					{:else}
						{#each scopes as sc}
							{@const isCurrent = String(sc.branch_id || '') === String(currentBranchId || '') && sc.role === currentRole}
							<button
								type="button"
								disabled={isSwitching || isCurrent}
								onclick={() => handleSwitch(sc.scope_id)}
								class="w-full text-left p-3 rounded-xl border transition flex items-center justify-between gap-2.5 {isCurrent
									? 'bg-[#0077B6]/30 border-[#00B4D8] text-white pointer-events-none'
									: 'bg-white/5 hover:bg-white/10 border-white/10 text-[#90E0EF]'}"
							>
								<div class="min-w-0">
									<div class="flex items-center gap-1.5 mb-0.5">
										<span class="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/10 text-white border border-white/10">
											{getRoleLabel(sc.role)}
										</span>
										{#if isCurrent}
											<span class="text-[9px] font-bold text-[#00B4D8] flex items-center gap-0.5">
												<CheckIcon class="w-3 h-3" />
												Aktif
											</span>
										{/if}
									</div>
									<div class="text-xs font-bold text-white truncate">
										{sc.branch_name || sc.tenant_name || 'Akses Global'}
									</div>
									{#if sc.tenant_name && sc.branch_name}
										<div class="text-[10px] text-[#90E0EF]/50 truncate flex items-center gap-1 mt-0.5">
											<BuildingIcon class="w-2.5 h-2.5 shrink-0" />
											<span>{sc.tenant_name}</span>
										</div>
									{/if}
								</div>

								{#if isCurrent}
									<div class="w-6 h-6 rounded-full bg-[#00B4D8] text-white flex items-center justify-center shrink-0">
										<CheckIcon class="w-3.5 h-3.5" />
									</div>
								{/if}
							</button>
						{/each}
					{/if}
				</div>

				<!-- Footer -->
				<div class="mt-4 pt-3 border-t border-white/10 flex justify-end">
					<button
						type="button"
						onclick={() => (isOpen = false)}
						class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition"
					>
						Tutup
					</button>
				</div>
			</LiquidGlassCard>
		</div>
	</div>
{/if}
