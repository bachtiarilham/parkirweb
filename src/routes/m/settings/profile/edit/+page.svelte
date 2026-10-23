<script lang="ts">
	import { goto } from '$app/navigation';
	import LiquidGlassCard from '$lib/components/ui/liquid-glass/LiquidGlassCard.svelte';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import CameraIcon from '@lucide/svelte/icons/camera';
	import UserIcon from '@lucide/svelte/icons/user';
	import MailIcon from '@lucide/svelte/icons/mail';
	import PhoneIcon from '@lucide/svelte/icons/phone';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { deserialize } from '$app/forms';

	let { data } = $props();

	let fullName = $state('');
	let email = $state('');
	$effect(() => {
		fullName = data.user?.full_name || '';
		email = data.user?.email || '';
	});
	let phoneNumber = $state('081234567890');
	let avatarPreview = $state<string | null>(null);
	let fileInput: HTMLInputElement | null = $state(null);

	let isSubmitting = $state(false);
	let successMsg = $state<string | null>(null);
	let errorMsg = $state<string | null>(null);

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				avatarPreview = event.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!fullName.trim()) {
			errorMsg = 'Nama lengkap tidak boleh kosong';
			return;
		}

		isSubmitting = true;
		errorMsg = null;
		successMsg = null;

		try {
			const formData = new FormData();
			formData.append('full_name', fullName.trim());
			formData.append('email', email.trim());
			formData.append('phone_number', phoneNumber.trim());

			const res = await fetch('?/updateProfile', {
				method: 'POST',
				body: formData
			});
			const text = await res.text();
			const result = deserialize(text) as any;
			const dataRes = (result.type === 'success' ? result.data : result.data) || {};

			if (result.type === 'success' && dataRes.success !== false) {
				successMsg = 'Profil berhasil diperbarui!';
				setTimeout(() => {
					goto('/m/settings/profile');
				}, 1200);
			} else {
				errorMsg = dataRes.message || 'Gagal memperbarui profil';
			}
		} catch (err: any) {
			errorMsg = err.message || 'Terjadi kesalahan sistem';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="space-y-4 pb-12 select-none">
	<!-- ── 1. Top Header Bar (Identik ProfilTopBar) ────────────────── -->
	<div class="flex items-center justify-between pt-1">
		<button
			type="button"
			onclick={() => history.back()}
			class="w-10 h-10 rounded-full bg-white/70 hover:bg-white border border-slate-200 flex items-center justify-center text-[#03045E] shadow-sm active:scale-95 transition"
			aria-label="Kembali"
		>
			<ChevronLeftIcon class="w-5 h-5 text-[#0077B6]" />
		</button>
		<h1 class="text-lg font-black text-[#03045E] tracking-tight">
			Edit Profil
		</h1>
		<button
			type="button"
			onclick={handleSubmit}
			disabled={isSubmitting}
			class="text-xs font-bold text-[#0077B6] hover:text-[#03045E] transition disabled:opacity-50"
		>
			Simpan
		</button>
	</div>

	<!-- Success / Error Alerts -->
	{#if successMsg}
		<div class="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in duration-150">
			<CheckIcon class="w-4 h-4 text-emerald-600" />
			<span>{successMsg}</span>
		</div>
	{/if}

	{#if errorMsg}
		<div class="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium animate-in fade-in duration-150">
			⚠️ {errorMsg}
		</div>
	{/if}

	<!-- ── 2. Avatar MemoJi / Foto Section ────────────────────────── -->
	<div class="flex flex-col items-center text-center py-2">
		<button
			type="button"
			class="relative group cursor-pointer bg-transparent border-0 p-0"
			onclick={() => fileInput?.click()}
			aria-label="Ubah foto profil"
		>
			{#if avatarPreview}
				<div class="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-xl shadow-sky-600/20">
					<img src={avatarPreview} alt="Avatar Preview" class="w-full h-full object-cover" />
				</div>
			{:else}
				<div class="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0077B6] to-[#00B4D8] text-white font-black text-3xl flex items-center justify-center border-2 border-white shadow-xl shadow-sky-600/20">
					{(fullName || 'U').charAt(0).toUpperCase()}
				</div>
			{/if}

			<!-- Camera Icon Badge -->
			<div class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#0077B6] text-white border-2 border-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
				<CameraIcon class="w-4 h-4" />
			</div>
		</button>

		<input
			type="file"
			bind:this={fileInput}
			accept="image/*"
			class="hidden"
			onchange={handleFileChange}
		/>

		<button
			type="button"
			onclick={() => fileInput?.click()}
			class="text-xs font-bold text-[#0077B6] mt-2 hover:underline cursor-pointer"
		>
			Ubah Foto Profil
		</button>
	</div>

	<!-- ── 3. Detail Form ─────────────────────────────────────────── -->
	<LiquidGlassCard variant="light" hasTopGloss={true} class="p-5 space-y-4">
		<h2 class="text-xs font-black text-[#03045E] uppercase tracking-wider">
			Detail Pribadi
		</h2>

		<form onsubmit={handleSubmit} class="space-y-3.5">
			<!-- Nama Lengkap -->
			<div>
				<label for="f-name" class="text-[11px] font-bold text-slate-600 block mb-1">
					Nama Lengkap
				</label>
				<div class="relative">
					<div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
						<UserIcon class="w-4 h-4" />
					</div>
					<input
						id="f-name"
						type="text"
						required
						bind:value={fullName}
						class="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-[#03045E] bg-white focus:outline-none focus:border-[#0077B6] transition"
						placeholder="Nama Lengkap"
					/>
				</div>
			</div>

			<!-- Email -->
			<div>
				<label for="f-email" class="text-[11px] font-bold text-slate-600 block mb-1">
					Alamat Email
				</label>
				<div class="relative">
					<div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
						<MailIcon class="w-4 h-4" />
					</div>
					<input
						id="f-email"
						type="email"
						required
						bind:value={email}
						class="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-[#03045E] bg-white focus:outline-none focus:border-[#0077B6] transition"
						placeholder="user@linespot.id"
					/>
				</div>
			</div>

			<!-- Nomor Telepon -->
			<div>
				<label for="f-phone" class="text-[11px] font-bold text-slate-600 block mb-1">
					Nomor WhatsApp / Telepon
				</label>
				<div class="relative">
					<div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
						<PhoneIcon class="w-4 h-4" />
					</div>
					<input
						id="f-phone"
						type="tel"
						bind:value={phoneNumber}
						class="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-[#03045E] bg-white focus:outline-none focus:border-[#0077B6] transition font-mono"
						placeholder="08123456789"
					/>
				</div>
			</div>

			<div class="pt-2">
				<button
					type="submit"
					disabled={isSubmitting}
					class="w-full py-3.5 rounded-xl bg-[#0077B6] hover:bg-[#0096C7] text-white font-bold text-xs shadow-md shadow-[#0077B6]/30 active:scale-98 transition disabled:opacity-50 cursor-pointer"
				>
					{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
				</button>
			</div>
		</form>
	</LiquidGlassCard>
</div>
