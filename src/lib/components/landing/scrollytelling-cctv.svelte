<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import * as THREE from "three";
	import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
	import gsap from "gsap";
	import { ScrollTrigger } from "gsap/ScrollTrigger";

	let canvasEl = $state<HTMLCanvasElement | null>(null);
	let sectionContainer = $state<HTMLDivElement | null>(null);
	let textInitial = $state<HTMLDivElement | null>(null);
	let textFinal = $state<HTMLDivElement | null>(null);
	let loadingIndicator = $state<HTMLDivElement | null>(null);

	let isLoading = $state(true);
	let loadProgress = $state(0);

	// Three.js instances for cleanup
	let renderer: THREE.WebGLRenderer | null = null;
	let scene: THREE.Scene | null = null;
	let camera: THREE.PerspectiveCamera | null = null;
	let modelRoot: THREE.Group | null = null;
	let animationFrameId: number | null = null;
	let ctx: gsap.Context | null = null;

	onMount(() => {
		if (typeof window === "undefined" || !canvasEl || !sectionContainer) return;

		// Register GSAP ScrollTrigger plugin
		gsap.registerPlugin(ScrollTrigger);

		// Initialize Three.js Scene, Camera, Renderer
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x050505); // Deep black obsidian
		scene.fog = new THREE.FogExp2(0x050505, 0.08);

		const width = canvasEl.clientWidth || window.innerWidth;
		const height = canvasEl.clientHeight || window.innerHeight;

		camera = new THREE.PerspectiveCamera(40, width / height, 0.05, 100);
		// Extreme macro close-up right in front of the lens optical element
		camera.position.set(0, 0, 0.65);
		camera.lookAt(0, 0, 0);

		// Pass the Svelte-bound canvas element directly to Three.js WebGLRenderer (No appendChild needed)
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

		// ==========================================
		// Cinematic Apple / Tesla Lighting Setup
		// ==========================================
		// 1. Soft Ambient Light for shadow detail
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
		scene.add(ambientLight);

		// 2. Directional Key Light (Pure White Crisp highlight)
		const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
		keyLight.position.set(2.5, 4, 3.5);
		keyLight.castShadow = true;
		keyLight.shadow.mapSize.width = 1024;
		keyLight.shadow.mapSize.height = 1024;
		scene.add(keyLight);

		// 3. Fill Light (Soft cool tone)
		const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.2);
		fillLight.position.set(-3, 1, 2);
		scene.add(fillLight);

		// 4. Rim Point Light (Violet / Optical Blue sheen for lens elements)
		const lensRimLight = new THREE.PointLight(0x818cf8, 4.5, 5, 1.8);
		lensRimLight.position.set(0.2, 0.4, 0.8);
		scene.add(lensRimLight);

		// 5. Back Rim Light for silhouette edge definition
		const backRimLight = new THREE.PointLight(0x38bdf8, 3.0, 6, 2);
		backRimLight.position.set(-1.5, 2.5, -2.5);
		scene.add(backRimLight);

		// Fallback procedural CCTV mesh if model fails or loading
		function createProceduralCCTV() {
			const group = new THREE.Group();

			// Camera cylindrical / bevelled body
			const bodyGeo = new THREE.CylinderGeometry(0.35, 0.38, 1.1, 48);
			bodyGeo.rotateX(Math.PI / 2);
			const bodyMat = new THREE.MeshStandardMaterial({
				color: 0x111113,
				metalness: 0.85,
				roughness: 0.28,
			});
			const body = new THREE.Mesh(bodyGeo, bodyMat);
			group.add(body);

			// Outer Lens Bezel Ring (Machined Aluminum Chamfer)
			const ringGeo = new THREE.TorusGeometry(0.32, 0.045, 24, 64);
			const ringMat = new THREE.MeshStandardMaterial({
				color: 0x27272a,
				metalness: 0.95,
				roughness: 0.18,
			});
			const ring = new THREE.Mesh(ringGeo, ringMat);
			ring.position.z = 0.56;
			group.add(ring);

			// Inner Lens Element (Optics Glass with multi-coating reflection)
			const lensGeo = new THREE.SphereGeometry(0.26, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2);
			const lensMat = new THREE.MeshPhysicalMaterial({
				color: 0x09090b,
				metalness: 0.1,
				roughness: 0.05,
				transmission: 0.85,
				ior: 1.52,
				clearcoat: 1.0,
				clearcoatRoughness: 0.1,
				reflectivity: 0.9,
			});
			const lens = new THREE.Mesh(lensGeo, lensMat);
			lens.position.z = 0.48;
			group.add(lens);

			// Sunshield hood
			const hoodGeo = new THREE.CylinderGeometry(0.39, 0.39, 0.45, 48, 1, true, 0, Math.PI);
			hoodGeo.rotateX(Math.PI / 2);
			hoodGeo.rotateZ(Math.PI / 2);
			const hoodMat = new THREE.MeshStandardMaterial({
				color: 0x18181b,
				metalness: 0.7,
				roughness: 0.35,
			});
			const hood = new THREE.Mesh(hoodGeo, hoodMat);
			hood.position.set(0, 0.06, 0.42);
			group.add(hood);

			// Mount arm bracket
			const armGeo = new THREE.BoxGeometry(0.12, 0.6, 0.18);
			const arm = new THREE.Mesh(armGeo, bodyMat);
			arm.position.set(0, -0.42, -0.25);
			group.add(arm);

			return group;
		}

		// Load GLTF Model
		const loader = new GLTFLoader();
		loader.load(
			"/models/cctv.glb",
			(gltf) => {
				modelRoot = gltf.scene;

				// Compute bounding box to normalize scale and center position
				const box = new THREE.Box3().setFromObject(modelRoot);
				const size = new THREE.Vector3();
				box.getSize(size);
				const maxDim = Math.max(size.x, size.y, size.z);
				const targetScale = 1.25 / (maxDim || 1);
				modelRoot.scale.setScalar(targetScale);

				const center = new THREE.Vector3();
				box.getCenter(center);
				modelRoot.position.sub(center.multiplyScalar(targetScale));

				// Enable shadow casting and smooth material enhancements
				modelRoot.traverse((child) => {
					if ((child as THREE.Mesh).isMesh) {
						const mesh = child as THREE.Mesh;
						mesh.castShadow = true;
						mesh.receiveShadow = true;

						if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
							const mat = mesh.material as THREE.MeshStandardMaterial;
							mat.envMapIntensity = 1.2;
							mat.needsUpdate = true;
						}
					}
				});

				scene?.add(modelRoot);
				isLoading = false;
				setupScrollytelling();
			},
			(xhr) => {
				if (xhr.total > 0) {
					loadProgress = Math.round((xhr.loaded / xhr.total) * 100);
				}
			},
			(error) => {
				console.warn("[CCTV 3D] Gagal memuat GLTF, menggunakan model prosedural Three.js:", error);
				// Fallback to high-precision procedural CCTV model
				modelRoot = createProceduralCCTV();
				scene?.add(modelRoot);
				isLoading = false;
				setupScrollytelling();
			}
		);

		// ==========================================
		// GSAP ScrollTrigger Animation Timeline
		// ==========================================
		function setupScrollytelling() {
			if (!camera || !modelRoot || !sectionContainer) return;

			ctx = gsap.context(() => {
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: sectionContainer,
						start: "top top",
						end: "+=220%",
						pin: true,
						scrub: 1.2,
						anticipatePin: 1,
					},
				});

				// Step 1: Camera moves smoothly backward on Z axis & slightly tilts
				// Camera initial: (0, 0, 0.65) -> Macro on lens
				tl.to(
					camera!.position,
					{
						x: 0.75,
						y: 0.35,
						z: 2.85,
						ease: "power2.inOut",
					},
					0
				);

				// Rotate model gently along Y and X axes to reveal full industrial chassis
				tl.to(
					modelRoot!.rotation,
					{
						y: -Math.PI * 0.45,
						x: 0.18,
						z: -0.05,
						ease: "power1.inOut",
					},
					0
				);

				// Move rim light with scroll for dynamic reflections across lens curvature
				tl.to(
					lensRimLight.position,
					{
						x: 1.2,
						y: 1.5,
						z: 2.2,
						ease: "none",
					},
					0
				);

				// Step 2: Fade Out Initial Text (Macro 4K Vision)
				if (textInitial) {
					tl.to(
						textInitial,
						{
							opacity: 0,
							y: -40,
							filter: "blur(8px)",
							ease: "power2.in",
						},
						0
					);
				}

				// Step 3: Fade In Final Text (Chassis / Sentinel AI Gate Cam)
				if (textFinal) {
					tl.fromTo(
						textFinal,
						{
							opacity: 0,
							y: 50,
							filter: "blur(10px)",
						},
						{
							opacity: 1,
							y: 0,
							filter: "blur(0px)",
							ease: "power2.out",
						},
						0.45
					);
				}
			}, sectionContainer);
		}

		// Animation Loop
		const clock = new THREE.Clock();
		const animate = () => {
			animationFrameId = requestAnimationFrame(animate);

			// Idle micro float rotation
			const elapsedTime = clock.getElapsedTime();
			if (modelRoot && !ScrollTrigger.isTouch) {
				modelRoot.position.y = Math.sin(elapsedTime * 0.8) * 0.015;
			}

			if (renderer && scene && camera) {
				renderer.render(scene, camera);
			}
		};
		animate();

		// Responsive Resize Handler
		const handleResize = () => {
			if (!canvasEl || !renderer || !camera) return;
			const newWidth = canvasEl.clientWidth || window.innerWidth;
			const newHeight = canvasEl.clientHeight || window.innerHeight;

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
		// Clean up GSAP context
		if (ctx) {
			ctx.revert();
			ctx = null;
		}

		// Stop animation loop
		if (animationFrameId !== null) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
		}

		// Kill all active ScrollTriggers
		ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

		// Dispose Three.js geometries, materials, textures, renderer
		if (modelRoot) {
			modelRoot.traverse((obj) => {
				if ((obj as THREE.Mesh).isMesh) {
					const mesh = obj as THREE.Mesh;
					mesh.geometry?.dispose();
					if (Array.isArray(mesh.material)) {
						mesh.material.forEach((mat) => mat.dispose());
					} else if (mesh.material) {
						mesh.material.dispose();
					}
				}
			});
			modelRoot = null;
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
	bind:this={sectionContainer}
	class="relative w-full h-screen overflow-hidden bg-[#050505] text-[#f5f5f7] select-none font-sans"
>
	<!-- Three.js Canvas Element Managed via Svelte bind:this -->
	<canvas
		bind:this={canvasEl}
		class="absolute inset-0 w-full h-full pointer-events-none z-0 block outline-none"
	></canvas>

	<!-- Loading Spinner Indicator -->
	{#if isLoading}
		<div
			bind:this={loadingIndicator}
			class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-700"
		>
			<div class="size-12 rounded-full border-2 border-zinc-800 border-t-white animate-spin mb-4"></div>
			<p class="text-xs font-mono uppercase tracking-widest text-[#86868b]">
				Memuat Model Optik Sentinel... {loadProgress > 0 ? `${loadProgress}%` : ""}
			</p>
		</div>
	{/if}

	<!-- Top Subtle Tech HUD Indicator -->
	<div class="absolute top-6 left-6 sm:top-10 sm:left-10 z-20 flex items-center gap-3">
		<div class="size-2 rounded-full bg-emerald-400 animate-pulse"></div>
		<span class="text-[11px] font-mono tracking-widest uppercase text-[#86868b]">
			OPTICS SPEC: SENTINEL-X4K • MULTI-COATED LENS
		</span>
	</div>

	<!-- Scroll Down Cue Indicator -->
	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none opacity-60">
		<span class="text-[10px] uppercase font-mono tracking-widest text-[#86868b]">
			Scroll untuk menjelajahi hardware
		</span>
		<div class="w-4 h-7 rounded-full border border-zinc-700 flex items-start justify-center p-1">
			<div class="size-1.5 rounded-full bg-white animate-bounce"></div>
		</div>
	</div>

	<!-- Scrollytelling Overlays Container -->
	<div class="relative z-10 w-full h-full max-w-6xl mx-auto px-6 sm:px-12 flex items-center justify-between pointer-events-none">
		
		<!-- State Awal (Sebelum Scroll): Extreme Macro Close-up Lensa -->
		<div
			bind:this={textInitial}
			class="max-w-xl space-y-4 text-left will-change-transform"
		>
			<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950/80 backdrop-blur-md text-xs font-mono text-zinc-400">
				<span class="size-1.5 rounded-full bg-cyan-400"></span>
				<span>SENSOR ALPR 4K</span>
			</div>

			<h2 class="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
				Membaca Plat Nomor Seketika.
			</h2>

			<p class="text-base sm:text-lg text-zinc-300 font-light">
				Akurat dan cepat di segala kondisi cahaya.
			</p>

			<p class="text-sm text-[#86868b] leading-relaxed max-w-md font-light">
				Kamera otomatis mengenali plat nomor saat kendaraan mendekati gerbang. Pengemudi tidak perlu membuka kaca atau antre mengambil karcis manual.
			</p>
		</div>

		<!-- State Akhir (Setelah Scroll): Zoom Out & Rotate Full Camera -->
		<div
			bind:this={textFinal}
			class="absolute right-6 sm:right-12 max-w-lg space-y-5 text-left opacity-0 pointer-events-none will-change-transform"
		>
			<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950/80 backdrop-blur-md text-xs font-mono text-zinc-400">
				<span class="size-1.5 rounded-full bg-emerald-400"></span>
				<span>HOUSING TAHAN CUACA</span>
			</div>

			<h2 class="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
				Andal Beroperasi 24 Jam.
			</h2>

			<p class="text-sm sm:text-base text-[#86868b] leading-relaxed font-light">
				Casing aluminium solid dengan perlindungan terhadap hujan dan debu. Bekerja stabil untuk gerbang gedung bertingkat maupun area terbuka.
			</p>

			<div class="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-800/80">
				<div>
					<div class="text-2xl font-bold text-white font-mono">99.8%</div>
					<div class="text-xs text-[#86868b]">Akurasi Baca Plat</div>
				</div>
				<div>
					<div class="text-2xl font-bold text-white font-mono">IP67</div>
					<div class="text-xs text-[#86868b]">Tahan Air & Debu</div>
				</div>
			</div>
		</div>

	</div>
</div>
