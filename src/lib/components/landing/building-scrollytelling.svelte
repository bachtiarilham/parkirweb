<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import ArrowDownIcon from "@lucide/svelte/icons/arrow-down";
	import Building2Icon from "@lucide/svelte/icons/building-2";
	import MapPinIcon from "@lucide/svelte/icons/map-pin";
	import ServerIcon from "@lucide/svelte/icons/server";
	import ShieldCheckIcon from "@lucide/svelte/icons/shield-check";
	import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";

	let { onRequestDemo = () => {} } = $props<{ onRequestDemo?: () => void }>();

	let canvasEl = $state<HTMLCanvasElement | null>(null);
	let scrollContainer = $state<HTMLDivElement | null>(null);
	let activeStage = $state(0);

	// Three.js instances (dynamically imported to minimize initial bundle size)
	let renderer: any = null;
	let scene: any = null;
	let camera: any = null;
	let modelGroup: any = null;
	let serverGlowLight: any = null;
	let gateSpotLight: any = null;
	let animationFrameId: number | null = null;
	let isRenderLoopRunning = false;
	let isVisibleInViewport = true;
	let intersectionObserver: IntersectionObserver | null = null;

	// Camera Waypoints for each section of the building
	const keyframes = [
		// 0: Overview / Hero (Zoom out seluruh kawasan gedung)
		{ x: 3.2, y: 4.0, z: 7.2, tx: 0, ty: 0.1, tz: 0, glow: 0.2 },
		// 1: On-Street (Kamera meluncur ke pinggir jalan - LineSpot)
		{ x: -4.5, y: 1.8, z: 4.2, tx: -1.2, ty: 0.3, tz: 0.8, glow: 0.2 },
		// 2: Off-Street (Kamera bergeser ke tempat parkir - Line Parking)
		{ x: 4.2, y: 1.6, z: 3.6, tx: 1.0, ty: 0.3, tz: 0.1, glow: 0.2 },
		// 3: Ruang Server (Kamera masuk ke dalam gedung / pusat data)
		{ x: 0.05, y: 2.1, z: 1.3, tx: 0, ty: 1.8, tz: -0.3, glow: 6.0 },
		// 4: Operasional Gerbang (Kamera swoop ke palang gerbang parkir)
		{ x: 1.9, y: 0.85, z: 2.1, tx: 1.2, ty: 0.55, tz: 1.1, glow: 0.5 },
	];

	// Current interpolated camera position
	let currentCam = {
		x: keyframes[0].x,
		y: keyframes[0].y,
		z: keyframes[0].z,
		tx: keyframes[0].tx,
		ty: keyframes[0].ty,
		tz: keyframes[0].tz,
		glow: keyframes[0].glow,
	};
	let targetCam = { ...currentCam };

	export function scrollToStage(index: number) {
		const targetEl = document.getElementById(`stage-${index}`);
		if (targetEl) {
			targetEl.scrollIntoView({ behavior: "smooth" });
		}
	}

	onMount(async () => {
		if (typeof window === "undefined" || !canvasEl || !scrollContainer) return;

		// Code-Splitting: Dynamically import Three.js to keep initial main bundle lightweight
		const THREE = await import("three");
		const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");

		// 1. Three.js Scene Setup
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x0a0a0c);
		scene.fog = new THREE.FogExp2(0x0a0a0c, 0.02);

		const width = window.innerWidth;
		const height = window.innerHeight;

		camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
		camera.position.set(currentCam.x, currentCam.y, currentCam.z);
		camera.lookAt(currentCam.tx, currentCam.ty, currentCam.tz);

		renderer = new THREE.WebGLRenderer({
			canvas: canvasEl,
			antialias: true,
			powerPreference: "high-performance",
		});
		renderer.setSize(width, height, false);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.4;
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		// 2. Cinematic Lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
		scene.add(ambientLight);

		const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
		keyLight.position.set(6, 12, 8);
		keyLight.castShadow = true;
		scene.add(keyLight);

		const blueRim = new THREE.DirectionalLight(0x38bdf8, 2.0);
		blueRim.position.set(-6, 8, -5);
		scene.add(blueRim);

		// Server Room Interior Glow Light
		serverGlowLight = new THREE.PointLight(0x00f0ff, 0.2, 8, 2);
		serverGlowLight.position.set(0, 2.1, -0.2);
		scene.add(serverGlowLight);

		// Gate Spotlight
		gateSpotLight = new THREE.SpotLight(0x10b981, 3.0, 12, Math.PI / 4, 0.3);
		gateSpotLight.position.set(2.0, 3.5, 3.0);
		gateSpotLight.target.position.set(1.4, 0.6, 1.4);
		scene.add(gateSpotLight);
		scene.add(gateSpotLight.target);

		// Ground Grid
		const grid = new THREE.GridHelper(28, 56, 0x3f3f46, 0x18181b);
		grid.position.y = -0.01;
		scene.add(grid);

		// 3. Fallback Procedural Office Scene (Instant First Paint without waiting for GLTF network fetch)
		function createProceduralOffice() {
			const grp = new THREE.Group();
			const tower = new THREE.Mesh(
				new THREE.BoxGeometry(2.4, 4.4, 2.4),
				new THREE.MeshStandardMaterial({ color: 0x1c1c21, roughness: 0.3, metalness: 0.8 })
			);
			tower.position.set(0, 2.2, -0.6);
			grp.add(tower);

			const glass = new THREE.Mesh(
				new THREE.BoxGeometry(2.45, 3.8, 0.1),
				new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, roughness: 0.1, transmission: 0.7 })
			);
			glass.position.set(0, 2.2, 0.55);
			grp.add(glass);

			const apron = new THREE.Mesh(
				new THREE.BoxGeometry(4.4, 0.25, 3.6),
				new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.6 })
			);
			apron.position.set(0, 0.12, 0.4);
			grp.add(apron);

			const pillar = new THREE.Mesh(
				new THREE.BoxGeometry(0.2, 0.9, 0.2),
				new THREE.MeshStandardMaterial({ color: 0x09090b, metalness: 0.9 })
			);
			pillar.position.set(1.4, 0.6, 1.4);
			grp.add(pillar);

			const boom = new THREE.Mesh(
				new THREE.CylinderGeometry(0.03, 0.03, 1.4),
				new THREE.MeshStandardMaterial({ color: 0xef4444 })
			);
			boom.rotation.z = Math.PI / 2;
			boom.position.set(0.7, 0.9, 1.4);
			grp.add(boom);

			return grp;
		}

		modelGroup = createProceduralOffice();
		scene.add(modelGroup);

		// 4. Progressive Load: Fetch real 3D model (Office.glb) in background
		const loader = new GLTFLoader();
		const candidatePaths = ["/models/Office.glb", "/models/office.glb"];

		function loadModel(idx: number) {
			if (idx >= candidatePaths.length) return;

			loader.load(
				candidatePaths[idx],
				(gltf) => {
					if (!scene) return;
					const newModel = gltf.scene;
					const box = new THREE.Box3().setFromObject(newModel);
					const size = new THREE.Vector3();
					box.getSize(size);
					const maxDim = Math.max(size.x, size.y, size.z);
					const scale = 5.5 / (maxDim || 1);
					newModel.scale.setScalar(scale);

					const center = new THREE.Vector3();
					box.getCenter(center);
					newModel.position.x = -center.x * scale;
					newModel.position.y = -box.min.y * scale;
					newModel.position.z = -center.z * scale;

					newModel.traverse((child: any) => {
						if (child.isMesh) {
							child.castShadow = true;
							child.receiveShadow = true;
							if (child.material && child.material.isMeshStandardMaterial) {
								child.material.envMapIntensity = 1.3;
							}
						}
					});

					if (modelGroup) scene.remove(modelGroup);
					modelGroup = newModel;
					scene.add(modelGroup);
				},
				undefined,
				() => loadModel(idx + 1)
			);
		}

		loadModel(0);

		// 5. Native Scroll Handler with Passive Listening
		const handleScroll = () => {
			if (!scrollContainer) return;
			const rect = scrollContainer.getBoundingClientRect();
			const totalScrollable = rect.height - window.innerHeight;
			if (totalScrollable <= 0) return;

			const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
			const scaledProgress = progress * (keyframes.length - 1);
			const baseIdx = Math.floor(scaledProgress);
			const nextIdx = Math.min(baseIdx + 1, keyframes.length - 1);
			const factor = scaledProgress - baseIdx;
			const ease = factor < 0.5 ? 2 * factor * factor : -1 + (4 - 2 * factor) * factor;

			const k1 = keyframes[baseIdx];
			const k2 = keyframes[nextIdx];

			targetCam.x = k1.x + (k2.x - k1.x) * ease;
			targetCam.y = k1.y + (k2.y - k1.y) * ease;
			targetCam.z = k1.z + (k2.z - k1.z) * ease;
			targetCam.tx = k1.tx + (k2.tx - k1.tx) * ease;
			targetCam.ty = k1.ty + (k2.ty - k1.ty) * ease;
			targetCam.tz = k1.tz + (k2.tz - k1.tz) * ease;
			targetCam.glow = k1.glow + (k2.glow - k1.glow) * ease;

			activeStage = Math.round(scaledProgress);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();

		// Custom jump stage event from navbar
		const handleJumpEvent = (e: any) => {
			if (typeof e.detail?.stage === "number") {
				scrollToStage(e.detail.stage);
			}
		};
		window.addEventListener("jump-building-stage", handleJumpEvent);

		// 6. Smooth Lerp Render Loop with GPU Throttling (Pauses offscreen/tab hidden)
		const render = () => {
			if (!isRenderLoopRunning) return;

			if (camera && renderer && scene) {
				currentCam.x += (targetCam.x - currentCam.x) * 0.08;
				currentCam.y += (targetCam.y - currentCam.y) * 0.08;
				currentCam.z += (targetCam.z - currentCam.z) * 0.08;
				currentCam.tx += (targetCam.tx - currentCam.tx) * 0.08;
				currentCam.ty += (targetCam.ty - currentCam.ty) * 0.08;
				currentCam.tz += (targetCam.tz - currentCam.tz) * 0.08;
				currentCam.glow += (targetCam.glow - currentCam.glow) * 0.08;

				camera.position.set(currentCam.x, currentCam.y, currentCam.z);
				camera.lookAt(currentCam.tx, currentCam.ty, currentCam.tz);

				if (serverGlowLight) {
					serverGlowLight.intensity = currentCam.glow;
				}

				if (activeStage === 0 && modelGroup) {
					modelGroup.rotation.y += 0.0008;
				}

				renderer.render(scene, camera);
			}
			animationFrameId = requestAnimationFrame(render);
		};

		function startRenderLoop() {
			if (!isRenderLoopRunning) {
				isRenderLoopRunning = true;
				animationFrameId = requestAnimationFrame(render);
			}
		}

		function stopRenderLoop() {
			isRenderLoopRunning = false;
			if (animationFrameId !== null) {
				cancelAnimationFrame(animationFrameId);
				animationFrameId = null;
			}
		}

		startRenderLoop();

		// Performance Optimization: IntersectionObserver pauses WebGL loop when scrolled past
		intersectionObserver = new IntersectionObserver(
			([entry]) => {
				isVisibleInViewport = entry.isIntersecting;
				if (isVisibleInViewport && !document.hidden) {
					startRenderLoop();
				} else {
					stopRenderLoop();
				}
			},
			{ threshold: 0.02 }
		);
		intersectionObserver.observe(scrollContainer);

		// Performance Optimization: Pause rendering when user switches tabs (saves battery/CPU)
		const handleVisibilityChange = () => {
			if (document.hidden) {
				stopRenderLoop();
			} else if (isVisibleInViewport) {
				startRenderLoop();
			}
		};
		document.addEventListener("visibilitychange", handleVisibilityChange);

		// Resize handler
		const handleResize = () => {
			if (!camera || !renderer || !canvasEl) return;
			const w = window.innerWidth;
			const h = window.innerHeight;
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
			renderer.setSize(w, h, false);
			handleScroll();
		};
		window.addEventListener("resize", handleResize);

		return () => {
			stopRenderLoop();
			if (intersectionObserver) intersectionObserver.disconnect();
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("jump-building-stage", handleJumpEvent);
		};
	});

	onDestroy(() => {
		if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
		if (intersectionObserver) intersectionObserver.disconnect();

		// Memory Management: Deep disposal of Three.js GPU buffers & context
		if (scene) {
			scene.traverse((obj: any) => {
				if (obj.geometry) obj.geometry.dispose();
				if (obj.material) {
					if (Array.isArray(obj.material)) {
						obj.material.forEach((mat: any) => mat.dispose());
					} else {
						obj.material.dispose();
					}
				}
			});
		}
		if (renderer) {
			renderer.dispose();
			renderer.forceContextLoss();
		}
	});
</script>

<!-- Container Keseluruhan Scrollytelling 3D Gedung -->
<div bind:this={scrollContainer} class="relative w-full bg-[#0a0a0c]">
	<!-- 1. Pinned Sticky Full-Screen 3D Viewport di Latar Belakang -->
	<div class="sticky top-0 h-screen w-full overflow-hidden bg-[#0a0a0c] z-0">
		<canvas bind:this={canvasEl} class="block h-full w-full"></canvas>

		<!-- Subtle dark edge vignette -->
		<div
			class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(5,5,8,0.85)_100%)]"
		></div>

		<!-- Navigasi Titik Stage di Sisi Kanan -->
		<div class="absolute right-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-4 items-end">
			{#each [
				{ label: "Overview", desc: "Kawasan Terpadu" },
				{ label: "On-Street", desc: "LineSpot (Jalan)" },
				{ label: "Off-Street", desc: "Line Parking (Gedung)" },
				{ label: "Ruang Server", desc: "Cloud Orchestrator" },
				{ label: "Operasional Gerbang", desc: "Gate in Action" },
			] as stage, i}
				<button
					type="button"
					onclick={() => scrollToStage(i)}
					class="group flex items-center gap-3 text-right cursor-pointer focus:outline-none"
				>
					<span
						class="text-[11px] font-mono transition-all duration-300 opacity-0 group-hover:opacity-100 {activeStage === i ? '!opacity-100 text-white font-semibold' : 'text-zinc-500'}"
					>
						{stage.label}
					</span>
					<div
						class="size-2.5 rounded-full transition-all duration-300 {activeStage === i ? 'bg-white scale-125 ring-4 ring-white/20' : 'bg-white/30 hover:bg-white/70'}"
					></div>
				</button>
			{/each}
		</div>

		<!-- Top Live Indicator -->
		<div class="absolute top-20 left-6 sm:left-10 z-20 flex items-center gap-2 pointer-events-none">
			<span class="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
			<span class="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
				Live 3D Ecosystem • PT Line Utama Berkah
			</span>
		</div>
	</div>

	<!-- 2. Konten Halaman Mengalir di Atas 3D (Forefront Real Scroll Flow) -->
	<div class="relative z-10 -mt-[100vh]">
		<!-- STAGE 0: HERO (Seluruh Gedung & Kawasan) -->
		<section
			id="stage-0"
			class="min-h-screen flex flex-col items-center justify-start pt-28 sm:pt-36 px-4 text-center"
		>
			<div class="max-w-3xl space-y-4">
				<div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 py-1.5 backdrop-blur-md">
					<Building2Icon class="size-3.5 text-blue-400" />
					<span class="text-xs font-mono tracking-widest uppercase text-zinc-300">
						Solusi Total Parkir Cerdas
					</span>
				</div>

				<h1 class="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-none drop-shadow-xl">
					Line Parking & LineSpot
				</h1>

				<p class="text-base sm:text-lg text-zinc-300 font-light max-w-xl mx-auto drop-shadow-md">
					Satu platform. Mengelola parkir gedung komersial dan jalan raya kota tanpa antrean.
				</p>

				<div class="pt-3 flex items-center justify-center gap-4">
					<button
						type="button"
						onclick={() => scrollToStage(1)}
						class="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black hover:bg-zinc-200 transition-all cursor-pointer shadow-xl"
					>
						Mulai Tur Produk
					</button>
					<button
						type="button"
						onclick={onRequestDemo}
						class="rounded-full border border-white/20 bg-black/60 px-7 py-3 text-sm font-medium text-white hover:bg-white/10 transition-all cursor-pointer backdrop-blur-sm"
					>
						Request Demo
					</button>
				</div>

				<!-- Scroll Hint -->
				<div class="pt-8 flex flex-col items-center gap-1.5 text-zinc-400">
					<span class="text-[11px] font-mono tracking-widest uppercase">Scroll ke bawah untuk melihat fitur</span>
					<ArrowDownIcon class="size-4 animate-bounce text-zinc-300" />
				</div>
			</div>
		</section>

		<!-- STAGE 1: ON-STREET (Kamera meluncur ke pinggir jalan) -->
		<section
			id="stage-1"
			class="min-h-screen flex items-center justify-start px-6 sm:px-12 md:px-20 py-16"
		>
			<div class="max-w-md rounded-3xl border border-emerald-500/30 bg-black/85 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
				<div class="flex items-center justify-between">
					<span class="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400">
						<MapPinIcon class="size-3.5" />
						ON-STREET SOLUTION
					</span>
					<span class="text-[10px] font-mono text-zinc-400">Pemda & Dishub</span>
				</div>

				<div class="flex items-center gap-3">
					<img
						src="/images/landing/jpg_linespot.png"
						alt="LineSpot Logo"
						width="120"
						height="36"
						loading="lazy"
						decoding="async"
						class="h-9 w-auto object-contain rounded"
					/>
				</div>

				<h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">
					LineSpot: Tepi Jalan
				</h2>

				<p class="text-sm text-zinc-300 leading-relaxed font-light">
					Digitalisasi parkir jalan raya kota. Ubah jukir konvensional menjadi operator digital modern.
				</p>

				<!-- 3 Poin Singkat, Padat, Jelas -->
				<div class="space-y-2.5 pt-2 border-t border-white/10 text-xs text-zinc-200">
					<div class="flex items-start gap-2.5">
						<CheckCircle2Icon class="size-4 text-emerald-400 shrink-0 mt-0.5" />
						<span><strong>POS Jukir Tahan Air:</strong> Cetak struk QR digital & terima tap e-Money/QRIS.</span>
					</div>
					<div class="flex items-start gap-2.5">
						<CheckCircle2Icon class="size-4 text-emerald-400 shrink-0 mt-0.5" />
						<span><strong>Sensor IoT Aspal:</strong> Deteksi durasi parkir & okupansi spot jalan per detik.</span>
					</div>
					<div class="flex items-start gap-2.5">
						<CheckCircle2Icon class="size-4 text-emerald-400 shrink-0 mt-0.5" />
						<span><strong>100% Bebas Bocor:</strong> Seluruh retribusi langsung masuk kas daerah Pemda.</span>
					</div>
				</div>

				<div class="pt-2">
					<button
						type="button"
						onclick={onRequestDemo}
						class="w-full rounded-full bg-emerald-500 hover:bg-emerald-400 text-black py-2.5 text-xs font-bold transition-all cursor-pointer"
					>
						Konsultasi Proyek Dishub / Pemda →
					</button>
				</div>
			</div>
		</section>

		<!-- STAGE 2: OFF-STREET (Kamera bergeser ke tempat parkir gedung) -->
		<section
			id="stage-2"
			class="min-h-screen flex items-center justify-end px-6 sm:px-12 md:px-20 py-16"
		>
			<div class="max-w-md rounded-3xl border border-blue-500/30 bg-black/85 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
				<div class="flex items-center justify-between">
					<span class="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400">
						<Building2Icon class="size-3.5" />
						OFF-STREET SOLUTION
					</span>
					<span class="text-[10px] font-mono text-zinc-400">Gedung, Mall, Bandara</span>
				</div>

				<div class="flex items-center gap-3">
					<img
						src="/images/landing/lineparking.png"
						alt="Line Parking Logo"
						width="120"
						height="36"
						loading="lazy"
						decoding="async"
						class="h-9 w-auto object-contain"
					/>
				</div>

				<h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">
					Line Parking: Gedung
				</h2>

				<p class="text-sm text-zinc-300 leading-relaxed font-light">
					Otomatisasi palang gerbang tanpa antrean tiket. Kendaraan keluar masuk secepat mobil lewat.
				</p>

				<!-- 3 Poin Singkat, Padat, Jelas -->
				<div class="space-y-2.5 pt-2 border-t border-white/10 text-xs text-zinc-200">
					<div class="flex items-start gap-2.5">
						<CheckCircle2Icon class="size-4 text-blue-400 shrink-0 mt-0.5" />
						<span><strong>Barrier Gate Servo 0.8s:</strong> Palang buka instan, antrean jam sibuk lenyap.</span>
					</div>
					<div class="flex items-start gap-2.5">
						<CheckCircle2Icon class="size-4 text-blue-400 shrink-0 mt-0.5" />
						<span><strong>Kamera LPR &lt; 0.5 Detik:</strong> Mengenali plat nomor nasional secara otomatis.</span>
					</div>
					<div class="flex items-start gap-2.5">
						<CheckCircle2Icon class="size-4 text-blue-400 shrink-0 mt-0.5" />
						<span><strong>Multi-Payment:</strong> Tap kartu e-Money bank, QRIS dinamis, dan member RFID.</span>
					</div>
				</div>

				<div class="pt-2">
					<button
						type="button"
						onclick={onRequestDemo}
						class="w-full rounded-full bg-white hover:bg-zinc-200 text-black py-2.5 text-xs font-bold transition-all cursor-pointer"
					>
						Modernisasi Gerbang Gedung →
					</button>
				</div>
			</div>
		</section>

		<!-- STAGE 3: RUANG SERVER (Kamera masuk ke dalam gedung / core data) -->
		<section
			id="stage-3"
			class="min-h-screen flex items-center justify-start px-6 sm:px-12 md:px-20 py-16"
		>
			<div class="max-w-md rounded-3xl border border-cyan-500/40 bg-black/90 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.2)] space-y-4">
				<div class="flex items-center justify-between">
					<span class="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400">
						<ServerIcon class="size-3.5" />
						CLOUD ORCHESTRATOR
					</span>
					<span class="text-[10px] font-mono text-cyan-300">Pusat Data & Kontrol</span>
				</div>

				<h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">
					Ruang Server: Satu Layar
				</h2>

				<p class="text-sm text-zinc-300 leading-relaxed font-light">
					Kendalikan seluruh palang gerbang dan juru parkir di berbagai kota dari satu dashboard terpusat.
				</p>

				<!-- 3 Poin Singkat, Padat, Jelas -->
				<div class="space-y-2.5 pt-2 border-t border-white/10 text-xs text-zinc-200">
					<div class="flex items-start gap-2.5">
						<CheckCircle2Icon class="size-4 text-cyan-400 shrink-0 mt-0.5" />
						<span><strong>Laporan Keuangan Real-Time:</strong> Audit transaksi per detik tanpa jeda.</span>
					</div>
					<div class="flex items-start gap-2.5">
						<CheckCircle2Icon class="size-4 text-cyan-400 shrink-0 mt-0.5" />
						<span><strong>Multi-Branch & Tenant:</strong> Kelola tarif, diskon tenant mall, dan hak akses staf.</span>
					</div>
					<div class="flex items-start gap-2.5">
						<CheckCircle2Icon class="size-4 text-cyan-400 shrink-0 mt-0.5" />
						<span><strong>Cloud Sync & Backup Otomatis:</strong> Data aman tersimpan dengan enkripsi perbankan.</span>
					</div>
				</div>

				<div class="pt-2">
					<button
						type="button"
						onclick={onRequestDemo}
						class="w-full rounded-full bg-cyan-500 hover:bg-cyan-400 text-black py-2.5 text-xs font-bold transition-all cursor-pointer"
					>
						Lihat Demo Dashboard Cloud →
					</button>
				</div>
			</div>
		</section>

		<!-- STAGE 4: OPERASIONAL GERBANG (Kamera swoop ke palang gerbang parkir) -->
		<section
			id="stage-4"
			class="min-h-screen flex items-center justify-end px-6 sm:px-12 md:px-20 py-16"
		>
			<div class="max-w-md rounded-3xl border border-yellow-500/30 bg-black/85 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
				<div class="flex items-center justify-between">
					<span class="inline-flex items-center gap-1.5 text-xs font-mono text-yellow-400">
						<ShieldCheckIcon class="size-3.5" />
						OPERASIONAL & HARDWARE
					</span>
					<span class="text-[10px] font-mono text-zinc-400">Keandalan 24/7</span>
				</div>

				<h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">
					Gerbang Beroperasi Tangguh
				</h2>

				<p class="text-sm text-zinc-300 leading-relaxed font-light">
					Perangkat keras industri tahan hujan badai, getaran, dan panas ekstrem. Siap beroperasi non-stop.
				</p>

				<!-- 3 Poin Singkat, Padat, Jelas -->
				<div class="space-y-2.5 pt-2 border-t border-white/10 text-xs text-zinc-200">
					<div class="flex items-start gap-2.5">
						<CheckCircle2Icon class="size-4 text-yellow-400 shrink-0 mt-0.5" />
						<span><strong>Proteksi Anti-Tabrak:</strong> Dual loop sensor & karet pengaman mencegah palang mengenai bodi mobil.</span>
					</div>
					<div class="flex items-start gap-2.5">
						<CheckCircle2Icon class="size-4 text-yellow-400 shrink-0 mt-0.5" />
						<span><strong>Mode Offline Mandiri:</strong> Gerbang tetap mencatat transaksi normal meski koneksi internet putus.</span>
					</div>
					<div class="flex items-start gap-2.5">
						<CheckCircle2Icon class="size-4 text-yellow-400 shrink-0 mt-0.5" />
						<span><strong>Bypass Darurat Manual:</strong> Tuas darurat mekanis jika terjadi pemadaman listrik total.</span>
					</div>
				</div>

				<div class="pt-2">
					<a
						href="/pricing"
						class="w-full inline-flex items-center justify-center rounded-full bg-white hover:bg-zinc-200 text-black py-2.5 text-xs font-bold transition-all cursor-pointer shadow-lg"
					>
						Lihat Paket & Biaya (Pricing) →
					</a>
				</div>
			</div>
		</section>
	</div>
</div>
