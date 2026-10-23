<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ZapIcon from '@lucide/svelte/icons/zap';
	import ZapOffIcon from '@lucide/svelte/icons/zap-off';
	import ImageIcon from '@lucide/svelte/icons/image';
	import KeyboardIcon from '@lucide/svelte/icons/keyboard';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import { deserialize } from '$app/forms';
	import { API_ENDPOINTS } from '$lib/api/endpoints.js';
	import { compressImage, formatBytes } from '$lib/utils/image-compressor.js';

	let videoElement: HTMLVideoElement | null = $state(null);
	let stream: MediaStream | null = $state(null);
	let isFlashOn = $state(false);
	let isProcessing = $state(false);
	let processingStage = $state<'compressing' | 'recognizing' | ''>('');
	let detectedPlate = $state('');
	let showBottomSheet = $state(false);
	let fileInput: HTMLInputElement | null = $state(null);
	let errorMessage = $state('');

	async function startCamera() {
		try {
			const constraints: MediaStreamConstraints = {
				video: {
					facingMode: { ideal: 'environment' },
					width: { ideal: 1920 },
					height: { ideal: 1080 }
				},
				audio: false
			};
			stream = await navigator.mediaDevices.getUserMedia(constraints);
			if (videoElement) {
				videoElement.srcObject = stream;
				await videoElement.play().catch(() => {});
			}
		} catch (err: any) {
			console.warn('Camera error:', err);
			errorMessage = 'Kamera tidak dapat diakses atau izin ditolak.';
		}
	}

	function stopCamera() {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			stream = null;
		}
	}

	async function toggleFlash() {
		if (!stream) return;
		const track = stream.getVideoTracks()[0];
		if (!track) return;
		try {
			const capabilities: any = track.getCapabilities?.() || {};
			if (capabilities.torch) {
				isFlashOn = !isFlashOn;
				await (track as any).applyConstraints({
					advanced: [{ torch: isFlashOn }]
				});
			} else {
				isFlashOn = !isFlashOn;
			}
		} catch (e) {
			console.warn('Torch error:', e);
		}
	}

	async function captureAndPredict() {
		if (isProcessing) return;
		isProcessing = true;
		processingStage = 'compressing';
		errorMessage = '';

		try {
			if (!videoElement || !videoElement.videoWidth) {
				errorMessage = 'Preview kamera belum siap';
				isProcessing = false;
				processingStage = '';
				return;
			}

			// 1. Ambil frame kamera dan kompres ke 1280px @ 0.75 quality (turun dari ~5MB ke ~100KB)
			const compressResult = await compressImage(videoElement, {
				maxDimension: 1280,
				quality: 0.75,
				mimeType: 'image/jpeg'
			});

			processingStage = 'recognizing';

			const formData = new FormData();
			formData.append('image', compressResult.blob, 'camera_capture.jpg');
			formData.append('file', compressResult.blob, 'camera_capture.jpg');

			const res = await fetch('?/ocr', {
				method: 'POST',
				body: formData
			});

			const text = await res.text();
			const result = deserialize(text) as any;
			const data = (result.type === 'success' ? result.data : result.data) || {};

			if (result.type === 'success' && data.success) {
				const plate = (data.plate_number || data.data?.plate_number || '').trim().toUpperCase();
				if (plate) {
					detectedPlate = plate;
					showBottomSheet = true;
				} else {
					errorMessage = 'Plat nomor tidak terdeteksi. Silakan coba lagi atau input manual.';
				}
			} else {
				errorMessage = data.message || 'Gagal mendeteksi plat nomor kendaraan';
			}
		} catch (err: any) {
			console.error('OCR Error:', err);
			errorMessage = err.message || 'Gagal memproses gambar OCR';
		} finally {
			isProcessing = false;
			processingStage = '';
		}
	}

	async function handleGallerySelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		isProcessing = true;
		processingStage = 'compressing';
		errorMessage = '';

		try {
			// 1. Kompres gambar dari galeri (bisa 8MB-15MB dari kamera HP) ke maks 1280px @ 0.75 quality
			const compressResult = await compressImage(file, {
				maxDimension: 1280,
				quality: 0.75,
				mimeType: 'image/jpeg'
			});

			processingStage = 'recognizing';

			const formData = new FormData();
			formData.append('image', compressResult.blob, file.name);
			formData.append('file', compressResult.blob, file.name);

			const res = await fetch('?/ocr', {
				method: 'POST',
				body: formData
			});

			const text = await res.text();
			const result = deserialize(text) as any;
			const data = (result.type === 'success' ? result.data : result.data) || {};

			if (result.type === 'success' && data.success) {
				const plate = (data.plate_number || data.data?.plate_number || '').trim().toUpperCase();
				if (plate) {
					detectedPlate = plate;
					showBottomSheet = true;
				} else {
					errorMessage = 'Plat nomor tidak terdeteksi pada gambar.';
				}
			} else {
				errorMessage = data.message || 'Gagal mendeteksi plat nomor dari galeri.';
			}
		} catch (err: any) {
			console.error('Gallery OCR Error:', err);
			errorMessage = err.message || 'Terjadi kesalahan saat memproses gambar';
		} finally {
			isProcessing = false;
			processingStage = '';
			target.value = '';
		}
	}

	function handleRetry() {
		showBottomSheet = false;
		detectedPlate = '';
		errorMessage = '';
	}

	function handleContinue() {
		const cleanPlate = detectedPlate.trim().toUpperCase();
		goto(`/m/jukir/vehicle/input?plateNumber=${encodeURIComponent(cleanPlate)}`);
	}

	onMount(() => {
		startCamera();
	});

	onDestroy(() => {
		stopCamera();
	});
</script>

<div class="fixed inset-0 z-50 bg-[#181A20] flex flex-col justify-between text-white select-none overflow-hidden">
	<!-- ── 1. Top Header Bar (Back, Title, Flash) ───────────── -->
	<div class="px-4 pt-4 pb-3 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
		<button
			onclick={() => goto('/m/jukir')}
			class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition border border-white/20"
			aria-label="Kembali"
		>
			<ArrowLeftIcon class="w-5 h-5" />
		</button>

		<h1 class="text-base font-bold text-white tracking-wide">
			Scan Plat Nomor
		</h1>

		<div class="flex items-center space-x-2">
			<!-- Flash Toggle -->
			<button
				onclick={toggleFlash}
				class="w-10 h-10 rounded-full {isFlashOn ? 'bg-amber-400 text-slate-950' : 'bg-white/20 text-white'} backdrop-blur-md flex items-center justify-center active:scale-95 transition border border-white/20"
				aria-label="Toggle Flash"
			>
				{#if isFlashOn}
					<ZapIcon class="w-5 h-5" />
				{:else}
					<ZapOffIcon class="w-5 h-5" />
				{/if}
			</button>
		</div>
	</div>

	<!-- ── Error Message Banner ──────────────────────────────────────── -->
	{#if errorMessage}
		<div class="absolute top-16 inset-x-4 z-30 bg-rose-500/90 text-white text-xs px-4 py-2.5 rounded-xl backdrop-blur-md border border-rose-400/40 text-center font-medium shadow-lg flex items-center justify-center gap-2 animate-in fade-in duration-200">
			<AlertCircleIcon class="w-4 h-4 shrink-0 text-white" />
			<span>{errorMessage}</span>
		</div>
	{/if}

	<!-- ── 2. Live Camera Viewfinder & Frame (1:1 linespotv3) ──────────── -->
	<div class="relative flex-1 flex items-center justify-center overflow-hidden">
		<!-- Camera Video Preview -->
		<video
			bind:this={videoElement}
			class="absolute inset-0 w-full h-full object-cover"
			playsinline
			autoplay
			muted
		></video>

		<!-- Target OCR Viewfinder Frame (Identik ParkSessionCameraScreen.kt) -->
		<div class="relative w-[85%] max-w-sm aspect-[16/9] border-2 border-[#00B4D8] rounded-2xl shadow-[0_0_20px_rgba(0,180,216,0.5)] flex items-center justify-center pointer-events-none">
			<!-- Corner brackets -->
			<div class="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
			<div class="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
			<div class="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
			<div class="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-white rounded-br-lg"></div>

			<!-- Scanning laser line -->
			<div class="w-full h-0.5 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent animate-pulse shadow-[0_0_10px_#00E5FF]"></div>
		</div>

		<div class="absolute bottom-6 inset-x-0 text-center pointer-events-none">
			<span class="bg-black/60 backdrop-blur-md text-white text-xs px-4 py-1.5 rounded-full border border-white/20">
				Posisikan plat nomor kendaraan di dalam bingkai
			</span>
		</div>

		<!-- Processing & Compression Status Overlay -->
		{#if isProcessing}
			<div class="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center z-30 animate-in fade-in duration-150">
				<div class="px-5 py-3.5 rounded-2xl bg-[#03045E]/85 border border-[#00B4D8]/50 text-center space-y-2 shadow-2xl shadow-sky-950/60 max-w-xs mx-4">
					<div class="w-7 h-7 border-2.5 border-[#00B4D8] border-t-transparent rounded-full animate-spin mx-auto"></div>
					<div class="text-xs font-bold text-white tracking-wide">
						{processingStage === 'compressing' ? '⚡ Mengompresi Gambar...' : '🔍 Memindai Plat Nomor...'}
					</div>
					<div class="text-[10px] text-sky-200/80">
						{processingStage === 'compressing' ? 'Mengoptimalkan muatan jaringan' : 'Inference via FastALPR (ONNX)'}
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- ── 3. Bottom Camera Controls ─────────────────────────────────── -->
	<div class="px-6 pb-8 pt-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-around z-20">
		<!-- Shortcut Manual Input -->
		<button
			onclick={() => goto('/m/jukir/vehicle/input')}
			class="flex flex-col items-center gap-1 text-slate-300 hover:text-white transition active:scale-95"
		>
			<div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
				<KeyboardIcon class="w-5 h-5" />
			</div>
			<span class="text-[10px] font-bold">Input Manual</span>
		</button>

		<!-- Big Shutter Button -->
		<button
			onclick={captureAndPredict}
			disabled={isProcessing}
			class="w-18 h-18 rounded-full bg-white p-1.5 shadow-2xl shadow-sky-500/50 active:scale-90 transition disabled:opacity-50"
			aria-label="Ambil Foto Plat"
		>
			<div class="w-full h-full rounded-full border-4 border-[#0077B6] bg-white flex items-center justify-center">
				{#if isProcessing}
					<div class="w-6 h-6 border-2 border-[#0077B6] border-t-transparent rounded-full animate-spin"></div>
				{:else}
					<div class="w-12 h-12 rounded-full bg-[#0077B6]"></div>
				{/if}
			</div>
		</button>

		<!-- Gallery Picker Button -->
		<button
			onclick={() => fileInput?.click()}
			disabled={isProcessing}
			class="flex flex-col items-center gap-1 text-slate-300 hover:text-white transition active:scale-95 disabled:opacity-50"
		>
			<div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
				<ImageIcon class="w-5 h-5" />
			</div>
			<span class="text-[10px] font-bold">Galeri</span>
		</button>

		<input
			type="file"
			bind:this={fileInput}
			accept="image/*"
			onchange={handleGallerySelect}
			class="hidden"
		/>
	</div>

	<!-- ── 4. Plate Detected Bottom Sheet (1:1 linespotv3 PlateDetectedBottomSheet) ── -->
	{#if showBottomSheet}
		<div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200">
			<div class="w-full max-w-md bg-[#1E222B]/95 backdrop-blur-xl border-t border-white/10 rounded-t-3xl p-6 shadow-2xl text-white animate-in slide-in-from-bottom duration-300">
				<!-- Handle bar -->
				<div class="w-12 h-1 bg-slate-500/40 rounded-full mx-auto mb-4"></div>

				<h3 class="text-sm font-semibold text-center text-[#94A3B8] mb-3">
					Nomor Plat Terdeteksi
				</h3>

				<!-- Editable Indonesian License Plate Box (1:1 linespotv3) -->
				<div class="relative my-2">
					<div class="bg-[#0F172A]/85 rounded-2xl px-5 py-4 border border-[#38BDF8]/40 shadow-inner flex items-center justify-center">
						<input
							type="text"
							bind:value={detectedPlate}
							class="w-full bg-transparent text-center font-mono font-black text-3xl tracking-widest uppercase focus:outline-none text-white selection:bg-sky-500"
							placeholder="B 1234 XYZ"
						/>
					</div>
					<div class="text-xs text-center text-[#64748B] mt-2">
						Ketuk teks plat di atas bila ingin memperbaiki karakter
					</div>
				</div>

				<!-- Action Buttons (Foto Ulang & Lanjut - 1:1 linespotv3) -->
				<div class="grid grid-cols-2 gap-3 mt-6">
					<button
						onclick={handleRetry}
						class="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#334155] hover:bg-[#475569] text-white font-bold text-sm active:scale-95 transition"
					>
						<RefreshCwIcon class="w-4 h-4 text-[#F87171]" />
						<span>Foto Ulang</span>
					</button>

					<button
						onclick={handleContinue}
						class="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#0077B6] hover:bg-[#0096C7] text-white font-bold text-sm shadow-lg shadow-[#0077B6]/40 active:scale-95 transition"
					>
						<span>Lanjut</span>
						<ArrowRightIcon class="w-4 h-4 text-white" />
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
