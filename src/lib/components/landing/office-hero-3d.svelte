<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import * as THREE from "three";
	import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
	import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

	let canvasEl = $state<HTMLCanvasElement | null>(null);
	let containerEl = $state<HTMLDivElement | null>(null);
	let isLoading = $state(true);
	let loadProgress = $state(0);
	let activeZone = $state<string>("gate");

	let renderer: THREE.WebGLRenderer | null = null;
	let scene: THREE.Scene | null = null;
	let camera: THREE.PerspectiveCamera | null = null;
	let controls: OrbitControls | null = null;
	let modelGroup: THREE.Group | null = null;
	let animationFrameId: number | null = null;

	// Hotspots kamera target
	const cameraTargets = {
		gate: { x: 4.5, y: 3.2, z: 6.0, targetX: 0, targetY: 0.5, targetZ: 0 },
		onstreet: { x: -5.0, y: 3.8, z: 4.5, targetX: -0.5, targetY: 0.2, targetZ: 0.5 },
		tower: { x: 0.2, y: 6.5, z: 7.5, targetX: 0, targetY: 1.5, targetZ: -0.5 },
	};

	export function focusZone(zone: "gate" | "onstreet" | "tower") {
		activeZone = zone;
		if (!camera || !controls) return;
		const cfg = cameraTargets[zone];

		// Smooth transition
		const startPos = camera.position.clone();
		const endPos = new THREE.Vector3(cfg.x, cfg.y, cfg.z);
		const startTarget = controls.target.clone();
		const endTarget = new THREE.Vector3(cfg.targetX, cfg.targetY, cfg.targetZ);

		let progress = 0;
		const duration = 45; // frames

		function animateCam() {
			progress++;
			const t = Math.min(progress / duration, 1);
			const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

			camera!.position.lerpVectors(startPos, endPos, ease);
			controls!.target.lerpVectors(startTarget, endTarget, ease);
			controls!.update();

			if (t < 1) {
				requestAnimationFrame(animateCam);
			}
		}
		animateCam();
	}

	onMount(() => {
		if (typeof window === "undefined" || !canvasEl || !containerEl) return;

		// 1. Scene
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x050505);
		scene.fog = new THREE.FogExp2(0x050505, 0.045);

		const width = containerEl.clientWidth || window.innerWidth;
		const height = containerEl.clientHeight || 580;

		// 2. Camera
		camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
		camera.position.set(cameraTargets.gate.x, cameraTargets.gate.y, cameraTargets.gate.z);

		// 3. Renderer
		renderer = new THREE.WebGLRenderer({
			canvas: canvasEl,
			antialias: true,
			powerPreference: "high-performance",
			alpha: false,
		});
		renderer.setSize(width, height, false);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.35;
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		// 4. Orbit Controls (Apple-style smooth damped orbit)
		controls = new OrbitControls(camera, canvasEl);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.enablePan = false;
		controls.maxPolarAngle = Math.PI / 2 - 0.05; // Do not go below ground
		controls.minDistance = 3.5;
		controls.maxDistance = 14;
		controls.autoRotate = true;
		controls.autoRotateSpeed = 0.65;
		controls.target.set(0, 0.6, 0);

		// 5. Cinematic Lighting (Enterprise Smart City Vibe)
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
		scene.add(ambientLight);

		// Sun Key Light
		const sunLight = new THREE.DirectionalLight(0xffffff, 2.8);
		sunLight.position.set(6, 10, 7);
		sunLight.castShadow = true;
		sunLight.shadow.mapSize.width = 1024;
		sunLight.shadow.mapSize.height = 1024;
		sunLight.shadow.bias = -0.0005;
		scene.add(sunLight);

		// Cool Blue Skylight
		const skyLight = new THREE.DirectionalLight(0x60a5fa, 1.2);
		skyLight.position.set(-6, 8, -4);
		scene.add(skyLight);

		// Ground Reflection Light (Emerald & Cyan subtle accent for smart tech)
		const techRimLight = new THREE.PointLight(0x06b6d4, 3.5, 12, 1.8);
		techRimLight.position.set(0, 0.3, 2.5);
		scene.add(techRimLight);

		// Ground Grid Grid Plane
		const grid = new THREE.GridHelper(24, 48, 0x27272a, 0x141416);
		grid.position.y = -0.02;
		scene.add(grid);

		// Procedural fallback building jika model gltf belum selesai
		function createProceduralOffice() {
			const group = new THREE.Group();

			// Main Modern High-Rise Building Tower
			const towerGeo = new THREE.BoxGeometry(2.2, 4.2, 2.2);
			const towerMat = new THREE.MeshStandardMaterial({
				color: 0x18181b,
				metalness: 0.8,
				roughness: 0.2,
			});
			const tower = new THREE.Mesh(towerGeo, towerMat);
			tower.position.set(0, 2.1, -0.6);
			tower.castShadow = true;
			tower.receiveShadow = true;
			group.add(tower);

			// Glass Facade strips
			const glassGeo = new THREE.BoxGeometry(2.25, 3.8, 0.08);
			const glassMat = new THREE.MeshPhysicalMaterial({
				color: 0x0ea5e9,
				metalness: 0.2,
				roughness: 0.1,
				transmission: 0.7,
				reflectivity: 0.9,
			});
			const glassFront = new THREE.Mesh(glassGeo, glassMat);
			glassFront.position.set(0, 2.1, 0.52);
			group.add(glassFront);

			// Podium / Off-Street Barrier Gate Checkpoint
			const podiumGeo = new THREE.BoxGeometry(4.2, 0.3, 3.6);
			const podiumMat = new THREE.MeshStandardMaterial({
				color: 0x27272a,
				roughness: 0.6,
			});
			const podium = new THREE.Mesh(podiumGeo, podiumMat);
			podium.position.set(0, 0.15, 0.4);
			podium.receiveShadow = true;
			group.add(podium);

			// Mini Gate Barrier Pillar with LED Strip
			const gatePillarGeo = new THREE.BoxGeometry(0.18, 0.9, 0.18);
			const gatePillarMat = new THREE.MeshStandardMaterial({
				color: 0x09090b,
				metalness: 0.9,
			});
			const gatePillar = new THREE.Mesh(gatePillarGeo, gatePillarMat);
			gatePillar.position.set(1.4, 0.6, 1.4);
			group.add(gatePillar);

			const ledGeo = new THREE.BoxGeometry(0.04, 0.8, 0.04);
			const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
			const led = new THREE.Mesh(ledGeo, ledMat);
			led.position.set(1.48, 0.6, 1.4);
			group.add(led);

			return group;
		}

		// 6. Load Office.glb (model kawasan enterprise)
		const loader = new GLTFLoader();
		const candidatePaths = ["/models/Office.glb", "/models/office.glb"];

		function loadModel(pathIndex: number) {
			if (pathIndex >= candidatePaths.length) {
				console.warn("[Office 3D] Model Office.glb tidak ditemukan, menggunakan representasi prosedural.");
				modelGroup = createProceduralOffice();
				scene?.add(modelGroup);
				isLoading = false;
				return;
			}

			loader.load(
				candidatePaths[pathIndex],
				(gltf) => {
					modelGroup = gltf.scene;

					// Normalize bounding box & scale
					const box = new THREE.Box3().setFromObject(modelGroup);
					const size = new THREE.Vector3();
					box.getSize(size);
					const maxDim = Math.max(size.x, size.y, size.z);
					const targetSize = 5.5; // skala proporsional panggung
					const scale = targetSize / (maxDim || 1);
					modelGroup.scale.setScalar(scale);

					const center = new THREE.Vector3();
					box.getCenter(center);
					modelGroup.position.x = -center.x * scale;
					modelGroup.position.y = -box.min.y * scale; // Letakkan di atas permukaan lantai (y=0)
					modelGroup.position.z = -center.z * scale;

					// Shadows & material polishing
					modelGroup.traverse((child) => {
						if ((child as THREE.Mesh).isMesh) {
							const mesh = child as THREE.Mesh;
							mesh.castShadow = true;
							mesh.receiveShadow = true;
							if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
								const mat = mesh.material as THREE.MeshStandardMaterial;
								mat.envMapIntensity = 1.3;
							}
						}
					});

					scene?.add(modelGroup);
					isLoading = false;
				},
				(xhr) => {
					if (xhr.total > 0) {
						loadProgress = Math.round((xhr.loaded / xhr.total) * 100);
					}
				},
				() => {
					loadModel(pathIndex + 1);
				}
			);
		}

		loadModel(0);

		// 7. Render Loop
		const animate = () => {
			animationFrameId = requestAnimationFrame(animate);
			controls?.update();
			if (renderer && scene && camera) {
				renderer.render(scene, camera);
			}
		};
		animate();

		// 8. Resize Handler
		const handleResize = () => {
			if (!containerEl || !renderer || !camera) return;
			const newWidth = containerEl.clientWidth || window.innerWidth;
			const newHeight = containerEl.clientHeight || 580;

			camera.aspect = newWidth / newHeight;
			camera.updateProjectionMatrix();

			renderer.setSize(newWidth, newHeight, false);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		};
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	});

	onDestroy(() => {
		if (animationFrameId !== null) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
		}

		if (controls) {
			controls.dispose();
			controls = null;
		}

		if (modelGroup) {
			modelGroup.traverse((obj) => {
				if ((obj as THREE.Mesh).isMesh) {
					const mesh = obj as THREE.Mesh;
					mesh.geometry?.dispose();
					if (Array.isArray(mesh.material)) {
						mesh.material.forEach((m) => m.dispose());
					} else if (mesh.material) {
						mesh.material.dispose();
					}
				}
			});
			modelGroup = null;
		}

		if (renderer) {
			renderer.dispose();
			renderer = null;
		}

		scene = null;
		camera = null;
	});
</script>

<div
	bind:this={containerEl}
	class="relative w-full h-[520px] sm:h-[620px] lg:h-[680px] rounded-3xl overflow-hidden border border-border/70 bg-[#050505] shadow-2xl shadow-black/80 select-none group"
>
	<!-- Three.js Canvas Element Managed by Svelte (No manual appendChild) -->
	<canvas
		bind:this={canvasEl}
		class="w-full h-full block cursor-grab active:cursor-grabbing outline-none"
	></canvas>

	<!-- Subtle Ambient Gradient -->
	<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80"></div>

	<!-- Loading Spinner Indicator -->
	{#if isLoading}
		<div class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-700">
			<div class="size-10 rounded-full border-2 border-zinc-800 border-t-emerald-400 animate-spin mb-3"></div>
			<p class="text-xs font-mono uppercase tracking-widest text-[#86868b]">
				Memuat Model Kawasan Enterprise... {loadProgress > 0 ? `${loadProgress}%` : ""}
			</p>
		</div>
	{/if}

	<!-- Top Tech Pill Overlay: PT Line Utama Berkah -->
	<div class="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex flex-col gap-1.5 pointer-events-none">
		<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 text-[11px] font-mono text-zinc-300 shadow-sm">
			<span class="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
			<span>PT LINE UTAMA BERKAH • SMART INFRASTRUCTURE 3D</span>
		</div>
		<p class="text-[10px] text-[#86868b] font-mono pl-1 hidden sm:block">
			Geser untuk memutar sudut pandang (360° Interactive Orbit)
		</p>
	</div>

	<!-- Interactive Zone Switcher Buttons (Apple-style pill selector) -->
	<div class="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/90 shadow-2xl">
		<button
			type="button"
			onclick={() => focusZone("gate")}
			class="px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer {activeZone === 'gate' ? 'bg-white text-black font-semibold shadow-xs' : 'text-zinc-400 hover:text-white'}"
		>
			Line Parking (Off-Street)
		</button>
		<button
			type="button"
			onclick={() => focusZone("onstreet")}
			class="px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer {activeZone === 'onstreet' ? 'bg-white text-black font-semibold shadow-xs' : 'text-zinc-400 hover:text-white'}"
		>
			LineSpot (On-Street)
		</button>
		<button
			type="button"
			onclick={() => focusZone("tower")}
			class="px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer {activeZone === 'tower' ? 'bg-white text-black font-semibold shadow-xs' : 'text-zinc-400 hover:text-white'}"
		>
			Enterprise Building
		</button>
	</div>

	<!-- Live Floating Metrics Widget (Top Right) -->
	<div class="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 hidden md:flex flex-col gap-2 pointer-events-none">
		<div class="p-3.5 rounded-2xl bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 space-y-1 text-right min-w-[170px]">
			<div class="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Total Ekosistem Aktif</div>
			<div class="text-xl font-bold font-mono text-white">48+ Kawasan</div>
			<div class="text-[10px] text-emerald-400 font-mono">100% Cashless Terintegrasi</div>
		</div>
	</div>
</div>
