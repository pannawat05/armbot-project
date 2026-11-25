<script>
	import { onMount } from 'svelte';
	import { preferences, t } from '#lib/site-preferences.svelte.js';

	let { selectedPart = $bindable('base') } = $props();

	let viewport = $state(/** @type {HTMLDivElement | null} */ (null));
	let status = $state({ key: 'viewer.loading', params: {} });
	let loadError = $state('');
	let meshParts = $state([]);
	let resetCamera = $state(() => {});

	const MODEL_URL = '/models/robotic_arm_reference_v5.glb';

	const partGroups = [
		{
			id: 'base',
			components: ['MG996R servo', 'Base casing', 'Rotating disc', 'Bearing race and fasteners']
		},
		{
			id: 'column',
			components: ['Column front face', 'Side rails', 'Rear cover', 'Column fasteners']
		},
		{
			id: 'shoulder',
			components: ['Shoulder housing', 'Bearing and flange', '8125MG servo', 'Motor cover']
		},
		{
			id: 'upperArm',
			components: ['Upper arm shell', 'Front/rear panels', 'Shell caps', 'Shoulder wiring']
		},
		{
			id: 'elbow',
			components: ['Elbow housing', 'Outer ring and bezel', 'MG996R servo', 'Ring bolts']
		},
		{
			id: 'forearm',
			components: ['Forearm shell', 'Front/rear panels', 'Shell caps', 'Elbow wiring']
		},
		{
			id: 'wrist',
			components: ['Wrist housing', 'Outer ring', 'MG90S servo', 'Wrist wiring']
		},
		{
			id: 'gripper',
			components: ['Gripper palm', 'Upper/lower jaws and pads', 'Linkages and pivots', 'MG90S servo']
		},
		{
			id: 'camera',
			components: ['ESP32-CAM PCB', 'OV2640 lens', 'RF shield', 'Camera mount']
		},
		{
			id: 'raspberryPi',
			components: ['BCM2712 processor', '40-pin GPIO header', 'USB and micro-HDMI ports', 'Wireless network']
		},
		{
			id: 'pca9685',
			components: ['16-channel, 12-bit PWM driver', 'SDA / SCL I²C', 'Servo signal headers', 'External servo power input']
		}
	];

	const componentTranslations = {
		th: {
			base: ['เซอร์โว MG996R', 'ฝาครอบฐาน', 'จานหมุน', 'ชุดลูกปืนและตัวยึด'],
			column: ['แผงด้านหน้าเสา', 'รางด้านข้าง', 'ฝาครอบด้านหลัง', 'สกรูยึดเสา'],
			shoulder: ['โครงหุ้มข้อต่อบ่า', 'ลูกปืนและหน้าแปลน', 'เซอร์โว 8125MG', 'ฝาครอบมอเตอร์'],
			upperArm: ['เปลือกแขนบน', 'แผงด้านหน้า/ด้านหลัง', 'ฝาปิดเปลือก', 'สายไฟข้อต่อบ่า'],
			elbow: ['โครงหุ้มข้อต่อศอก', 'วงแหวนและขอบครอบ', 'เซอร์โว MG996R', 'สลักเกลียววงแหวน'],
			forearm: ['เปลือกแขนล่าง', 'แผงด้านหน้า/ด้านหลัง', 'ฝาปิดเปลือก', 'สายไฟข้อต่อศอก'],
			wrist: ['โครงหุ้มข้อมือ', 'วงแหวนรอบนอก', 'เซอร์โว MG90S', 'สายไฟข้อมือ'],
			gripper: ['ฝ่ามือกริปเปอร์', 'ปากจับบน/ล่างและแผ่นรอง', 'ก้านเชื่อมและจุดหมุน', 'เซอร์โว MG90S'],
			camera: ['แผงวงจร ESP32-CAM', 'เลนส์ OV2640', 'แผ่นป้องกันสัญญาณรบกวน', 'ขายึดกล้อง'],
			raspberryPi: ['ชิปประมวลผล BCM2712', 'ขา GPIO 40 พิน', 'พอร์ต USB และ micro-HDMI', 'เครือข่ายไร้สาย'],
			pca9685: ['ไดรเวอร์ PWM 16 ช่อง 12 บิต', 'I²C SDA / SCL', 'ขาสัญญาณเซอร์โว', 'ช่องจ่ายไฟเซอร์โวภายนอก']
		},
		ja: {
			base: ['MG996Rサーボ', 'ベースケース', '回転ディスク', 'ベアリングと固定具'],
			column: ['支柱前面パネル', 'サイドレール', '背面カバー', '支柱固定具'],
			shoulder: ['ショルダーハウジング', 'ベアリングとフランジ', '8125MGサーボ', 'モーターカバー'],
			upperArm: ['上腕シェル', '前面/背面パネル', 'シェルキャップ', 'ショルダー配線'],
			elbow: ['エルボーハウジング', '外側リングとベゼル', 'MG996Rサーボ', 'リングボルト'],
			forearm: ['前腕シェル', '前面/背面パネル', 'シェルキャップ', '肘配線'],
			wrist: ['手首ハウジング', '外側リング', 'MG90Sサーボ', '手首配線'],
			gripper: ['グリッパー本体', '上下の爪とパッド', 'リンク機構と支点', 'MG90Sサーボ'],
			camera: ['ESP32-CAM基板', 'OV2640レンズ', 'RFシールド', 'カメラマウント'],
			raspberryPi: ['BCM2712プロセッサ', '40ピンGPIOヘッダー', 'USBおよびmicro-HDMIポート', '無線ネットワーク'],
			pca9685: ['16チャンネル12ビットPWMドライバー', 'I²C SDA / SCL', 'サーボ信号ヘッダー', '外部サーボ電源入力']
		}
	};

	function getComponents(part) {
		return componentTranslations[preferences.locale]?.[part.id] ?? part.components;
	}

	function getPartId(name) {
		if (/^Base_/.test(name)) return 'base';
		if (/^(Column_|Upright_)/.test(name)) return 'column';
		if (/^(Shoulder_|MG90S_shoulder|Shoulder_wire)/.test(name)) return 'shoulder';
		if (/^Upper_arm_/.test(name)) return 'upperArm';
		if (/^(Elbow_|8225MG_elbow|Elbow_wire)/.test(name)) return 'elbow';
		if (/^Forearm_/.test(name)) return 'forearm';
		if (/^(Wrist_|MG90S_wrist)/.test(name)) return 'wrist';
		if (/^(Gripper_|MG90S_gripper)/.test(name)) return 'gripper';
		if (/^(ESP32_CAM|OV2640_|Camera_mount)/.test(name)) return 'camera';
		return '';
	}

	function materialColor(name, partId) {
		if (/screw|bolt|bearing|flange|ring|spline|gear_boss|pivot/i.test(name)) return 0x929992;
		if (/MG90S_|8225MG_/.test(name)) {
			return /spline|gear_boss|earhole|screw/.test(name) ? 0x9ca5a2 : 0x303a3d;
		}
		if (/ESP32_CAM_PCB/.test(name)) return 0x347a58;
		if (/OV2640_lens_(glass|barrel)/.test(name)) return 0x172326;
		if (/wire/.test(name)) return 0x626963;
		if (partId === 'base' || partId === 'column') return 0xbbbeb5;
		if (partId === 'gripper') return 0xd7d8d0;
		if (partId === 'camera') return 0x343b3c;
		return 0xd0d2cb;
	}

	function addControllerBoards(THREE, parent, interactiveMeshes) {
		const makeMaterial = (color, metalness = 0.1) =>
			new THREE.MeshStandardMaterial({ color, metalness, roughness: 0.56, emissive: 0x000000 });
		const piMaterials = {
			board: makeMaterial(0x28744d),
			chip: makeMaterial(0x22292c, 0.24),
			metal: makeMaterial(0xb6bbb4, 0.68),
			connector: makeMaterial(0x343b3c, 0.28),
			header: makeMaterial(0xc69c4a, 0.58)
		};
		const pcaMaterials = {
			board: makeMaterial(0x347a58),
			chip: makeMaterial(0x22292c, 0.24),
			metal: makeMaterial(0xb6bbb4, 0.68),
			connector: makeMaterial(0x303738, 0.24),
			header: makeMaterial(0xc69c4a, 0.58)
		};

		const addBoardPart = (group, id, name, geometry, material, position) => {
			const mesh = new THREE.Mesh(geometry, material);
			mesh.name = name;
			mesh.position.set(...position);
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			mesh.userData.partId = id;
			group.add(mesh);
			interactiveMeshes.push(mesh);
			return mesh;
		};

		const pi = new THREE.Group();
		pi.name = 'Raspberry Pi 5 control board';
		pi.position.set(103, -14, 0.8);
		parent.add(pi);
		const piBox = (name, width, depth, height, material, position) =>
			addBoardPart(
				pi,
				'raspberryPi',
				`Raspberry Pi 5 ${name}`,
				new THREE.BoxGeometry(width, depth, height),
				material,
				position
			);

		piBox('PCB', 85, 56, 1.6, piMaterials.board, [0, 0, 0]);
		piBox('BCM2712 processor', 19, 19, 3.2, piMaterials.chip, [2, -2, 2.4]);
		piBox('memory and power chips', 13, 10, 2.6, piMaterials.chip, [-14, -12, 2.2]);
		piBox('USB ports', 8, 28, 7, piMaterials.metal, [39, 7, 4.3]);
		piBox('micro-HDMI ports', 18, 7, 5, piMaterials.metal, [-34, 8, 3.5]);
		piBox('USB-C power connector', 8, 10, 6, piMaterials.metal, [-39, -15, 4]);
		piBox('GPIO header base', 46, 4, 4, piMaterials.connector, [0, 22, 3.6]);
		piBox('GPIO pins', 43, 2, 4, piMaterials.header, [0, 22, 7.2]);
		piBox('camera and display connectors', 12, 5, 3, piMaterials.connector, [28, -20, 3.1]);

		const pca = new THREE.Group();
		pca.name = 'PCA9685 servo driver';
		pca.position.set(102, 33, 0.8);
		parent.add(pca);
		const pcaBox = (name, width, depth, height, material, position) =>
			addBoardPart(
				pca,
				'pca9685',
				`PCA9685 ${name}`,
				new THREE.BoxGeometry(width, depth, height),
				material,
				position
			);

		pcaBox('PCB', 62, 27, 1.6, pcaMaterials.board, [0, 0, 0]);
		pcaBox('PWM driver IC', 13, 12, 3, pcaMaterials.chip, [-3, 0, 2.3]);
		pcaBox('power terminal', 10, 7, 5, pcaMaterials.connector, [23, -7, 4.1]);
		pcaBox('I2C header', 12, 4, 4, pcaMaterials.connector, [-22, 7, 3.6]);
		pcaBox('I2C pins', 10, 2, 4, pcaMaterials.header, [-22, 7, 7.2]);

		for (let pin = 0; pin < 8; pin += 1) {
			for (const row of [-1, 1]) {
				const x = -17 + pin * 4.8;
				pcaBox(`servo channel ${pin + 1} ${row === -1 ? 'signal' : 'power'}`, 2.4, 3.5, 3, pcaMaterials.connector, [
					x,
					row * 8,
					2.3
				]);
			}
		}
	}

	function selectPart(id) {
		selectedPart = id;
	}

	$effect(() => {
		const activeId = selectedPart;
		for (const mesh of meshParts) {
			mesh.material.emissive.setHex(mesh.userData.partId === activeId ? 0x384d15 : 0x000000);
			mesh.material.emissiveIntensity = 0.55;
		}
	});

	onMount(() => {
		let disposed = false;
		let renderer;
		let controls;
		let resizeObserver;
		let animationFrame = 0;
		let modelRoot;
		let pointerStart;
		let handlePointerDown;
		let handlePointerUp;
		let handlePointerLeave;
		const interactiveMeshes = [];

		async function initializeViewer() {
			try {
				const [THREE, { GLTFLoader }, { OrbitControls }] = await Promise.all([
					import('three'),
					import('three/addons/loaders/GLTFLoader.js'),
					import('three/addons/controls/OrbitControls.js')
				]);
				if (disposed || !viewport) return;

				const scene = new THREE.Scene();
				scene.background = new THREE.Color(0x121410);

				const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
				camera.up.set(0, 1, 0);

				renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
				renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
				renderer.outputColorSpace = THREE.SRGBColorSpace;
				renderer.toneMapping = THREE.ACESFilmicToneMapping;
				renderer.toneMappingExposure = 1.15;
				renderer.domElement.setAttribute('aria-label', t('viewer.canvas'));
				viewport.appendChild(renderer.domElement);

				scene.add(new THREE.HemisphereLight(0xf4f5ed, 0x33382e, 2));
				const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
				keyLight.position.set(1.5, 2.8, 2);
				scene.add(keyLight);
				const fillLight = new THREE.DirectionalLight(0xd3f36b, 1.15);
				fillLight.position.set(-2, 1, -1.5);
				scene.add(fillLight);

				const grid = new THREE.GridHelper(1.2, 24, 0x46513b, 0x262b22);
				grid.position.y = -0.37;
				scene.add(grid);

				const assembly = new THREE.Group();
				assembly.scale.setScalar(0.003);
				assembly.rotation.x = -Math.PI / 2;
				scene.add(assembly);

				const loader = new GLTFLoader();
				const gltf = await loader.loadAsync(MODEL_URL);
				if (disposed) return;

				modelRoot = gltf.scene;
				addControllerBoards(THREE, modelRoot, interactiveMeshes);
				modelRoot.updateMatrixWorld(true);
				const bounds = new THREE.Box3().setFromObject(modelRoot);
				const center = bounds.getCenter(new THREE.Vector3());
				modelRoot.position.sub(center);

				const materials = new Map();
				modelRoot.traverse((object) => {
					if (!object.isMesh) return;
					const partId = getPartId(object.name);
					if (!partId) return;

					let material = materials.get(object.name);
					if (!material) {
						material = new THREE.MeshStandardMaterial({
							color: materialColor(object.name, partId),
							metalness: /screw|bolt|bearing|flange|ring|spline/i.test(object.name) ? 0.62 : 0.16,
							roughness: /screw|bolt|bearing|flange|ring|spline/i.test(object.name) ? 0.32 : 0.62,
							emissive: 0x000000
						});
						materials.set(object.name, material);
					}

					object.material = material;
					object.castShadow = true;
					object.receiveShadow = true;
					object.userData.partId = partId;
					interactiveMeshes.push(object);
				});
				meshParts = [...interactiveMeshes];
				assembly.add(modelRoot);

				const viewWidth = Math.max(viewport.clientWidth, 1);
				const viewHeight = Math.max(viewport.clientHeight, 1);
				camera.aspect = viewWidth / viewHeight;
				camera.updateProjectionMatrix();
				assembly.updateMatrixWorld(true);
				const sceneBounds = new THREE.Box3().setFromObject(assembly);
				const sceneSize = sceneBounds.getSize(new THREE.Vector3());
				const sceneCenter = sceneBounds.getCenter(new THREE.Vector3());
				const verticalFovTangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
				const cameraDistance =
					Math.max(
						sceneSize.y / (2 * verticalFovTangent),
						sceneSize.x / (2 * verticalFovTangent * camera.aspect),
						sceneSize.z / (2 * verticalFovTangent)
					) * 1.35;
				const cameraDirection = new THREE.Vector3(0.85, 0.6, 1.05).normalize();
				const initialCameraPosition = sceneCenter
					.clone()
					.addScaledVector(cameraDirection, cameraDistance);
				grid.position.y = sceneBounds.min.y - 0.0015;

				controls = new OrbitControls(camera, renderer.domElement);
				controls.enableDamping = true;
				controls.dampingFactor = 0.06;
				controls.enablePan = true;
				controls.minDistance = 0.55;
				controls.maxDistance = 3.5;
				controls.target.copy(sceneCenter);
				camera.position.copy(initialCameraPosition);
				controls.update();
				resetCamera = () => {
					camera.position.copy(initialCameraPosition);
					controls.target.copy(sceneCenter);
					controls.update();
				};

				const updateSize = () => {
					if (!viewport || !renderer) return;
					const width = Math.max(viewport.clientWidth, 1);
					const height = Math.max(viewport.clientHeight, 1);
					camera.aspect = width / height;
					camera.updateProjectionMatrix();
					renderer.setSize(width, height);
				};
				resizeObserver = new ResizeObserver(updateSize);
				resizeObserver.observe(viewport);
				updateSize();

				const raycaster = new THREE.Raycaster();
				const pointer = new THREE.Vector2();
				handlePointerDown = (event) => {
					pointerStart = { x: event.clientX, y: event.clientY };
				};
				handlePointerUp = (event) => {
					if (
						!pointerStart ||
						Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 5
					) {
						pointerStart = undefined;
						return;
					}
					pointerStart = undefined;
					const rect = renderer.domElement.getBoundingClientRect();
					pointer.set(
						((event.clientX - rect.left) / rect.width) * 2 - 1,
						-((event.clientY - rect.top) / rect.height) * 2 + 1
					);
					raycaster.setFromCamera(pointer, camera);
					const hit = raycaster.intersectObjects(interactiveMeshes, false)[0];
					if (hit?.object.userData.partId) selectPart(hit.object.userData.partId);
				};
				handlePointerLeave = () => (pointerStart = undefined);
				renderer.domElement.addEventListener('pointerdown', handlePointerDown);
				renderer.domElement.addEventListener('pointerup', handlePointerUp);
				renderer.domElement.addEventListener('pointerleave', handlePointerLeave);

				let renderedCanvasLabel = t('viewer.canvas');
				const render = () => {
					if (disposed) return;
					animationFrame = window.requestAnimationFrame(render);
					controls.update();
					scene.background.setHex(preferences.theme === 'light' ? 0xf3f4ef : 0x121410);
					const canvasLabel = t('viewer.canvas');
					if (canvasLabel !== renderedCanvasLabel) {
						renderer.domElement.setAttribute('aria-label', canvasLabel);
						renderedCanvasLabel = canvasLabel;
					}
					renderer.render(scene, camera);
				};
				render();
				status = { key: 'viewer.loaded', params: { count: interactiveMeshes.length } };
			} catch (error) {
				console.error('Unable to load the ARMbot structure model:', error);
				if (!disposed) {
				status = { key: 'viewer.loadFailed', params: {} };
				loadError = 'viewer.loadError';
				}
			}
		}

		initializeViewer();

		return () => {
			disposed = true;
			window.cancelAnimationFrame(animationFrame);
			resizeObserver?.disconnect();
			controls?.dispose();
			renderer?.domElement.removeEventListener('pointerdown', handlePointerDown);
			renderer?.domElement.removeEventListener('pointerup', handlePointerUp);
			renderer?.domElement.removeEventListener('pointerleave', handlePointerLeave);
			if (modelRoot) {
				modelRoot.traverse((object) => {
					if (!object.isMesh) return;
					object.geometry.dispose();
					object.material.dispose();
				});
			}
			renderer?.dispose();
			renderer?.domElement.remove();
		};
	});

	let activePart = $derived(partGroups.find((part) => part.id === selectedPart) ?? partGroups[0]);
</script>

<section class="structure-viewer" aria-label={t('viewer.aria')}>
	<div class="model-panel">
		<div class="viewer-toolbar">
			<div>
				<p class="eyebrow"><span></span> {t('viewer.model')}</p>
				<p class="viewer-status">{t(status.key, status.params)}</p>
			</div>
			<div class="viewer-actions">
				<span class="orbit-hint">{t('viewer.rotateHint')}</span>
				<button class="reset-button" onclick={resetCamera} aria-label={t('viewer.resetAria')}>
					{t('viewer.reset')}
				</button>
			</div>
		</div>
		<div class="model-viewport" bind:this={viewport}>
			{#if loadError}
				<p class="load-error" role="alert">{t(loadError)}</p>
			{/if}
		</div>
	</div>

	<aside class="component-panel" aria-label={t('viewer.partsAria')}>
		<p class="eyebrow">{t('viewer.componentMap')}</p>
		<h2>{t('viewer.choosePart')}</h2>
		<p class="panel-intro">{t('viewer.chooseHint')}</p>
		<div class="part-buttons">
			{#each partGroups as part (part.id)}
				<button
					class:selected={selectedPart === part.id}
					aria-pressed={selectedPart === part.id}
					onclick={() => selectPart(part.id)}
				>
					<span class="part-index">{String(partGroups.indexOf(part) + 1).padStart(2, '0')}</span>
					<span>{t(`part.${part.id}.label`)}</span>
					<span class="part-arrow" aria-hidden="true">↗</span>
				</button>
			{/each}
		</div>
		<div class="part-details" aria-live="polite">
			<p class="eyebrow">{t('viewer.selectedPart')}</p>
			<h3>{t(`part.${activePart.id}.title`)}</h3>
			<p>{t(`part.${activePart.id}.description`)}</p>
			<ul>
				{#each getComponents(activePart) as component (component)}
					<li>{component}</li>
				{/each}
			</ul>
		</div>
	</aside>
</section>

<style>
	.structure-viewer {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 310px;
		min-height: 640px;
		overflow: hidden;
		border: 1px solid rgba(240, 241, 235, 0.13);
		border-radius: 11px;
		background: #151713;
	}

	.model-panel {
		display: flex;
		min-width: 0;
		flex-direction: column;
		background: #121410;
	}

	.viewer-toolbar {
		position: relative;
		z-index: 1;
		display: flex;
		min-height: 68px;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 14px 20px;
		border-bottom: 1px solid rgba(240, 241, 235, 0.1);
		background: #151713;
	}

	.eyebrow {
		margin: 0;
		color: #a7aaa0;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.16em;
	}

	.eyebrow span {
		display: inline-block;
		width: 6px;
		height: 6px;
		margin-right: 7px;
		border-radius: 50%;
		background: #d3f36b;
	}

	.viewer-status,
	.panel-intro {
		margin: 7px 0 0;
		color: #777b70;
		font-size: 10px;
	}

	.orbit-hint {
		color: #777b70;
		font-size: 9px;
		text-align: right;
	}

	.viewer-actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.reset-button {
		padding: 8px 10px;
		border: 1px solid rgba(240, 241, 235, 0.18);
		border-radius: 5px;
		background: transparent;
		color: #a7aaa0;
		cursor: pointer;
		font-size: 8px;
		letter-spacing: 0.12em;
	}

	.reset-button:hover {
		border-color: rgba(211, 243, 107, 0.45);
		color: #d3f36b;
	}

	.model-viewport {
		position: relative;
		min-height: 570px;
		flex: 1;
		overflow: hidden;
		background: #121410;
	}

	.model-viewport :global(canvas) {
		display: block;
		width: 100%;
		height: 100%;
		touch-action: none;
	}

	.load-error {
		position: absolute;
		z-index: 1;
		top: 50%;
		right: 20px;
		left: 20px;
		color: #ff9a89;
		font-size: 13px;
		text-align: center;
	}

	.component-panel {
		padding: 24px 20px;
		border-left: 1px solid rgba(240, 241, 235, 0.12);
		background: #171914;
	}

	.component-panel h2 {
		margin: 11px 0 0;
		color: #e6e8df;
		font-size: 18px;
		font-weight: 550;
		letter-spacing: -0.035em;
	}

	.part-buttons {
		display: grid;
		gap: 5px;
		margin-top: 20px;
	}

	.part-buttons button {
		display: flex;
		min-height: 38px;
		align-items: center;
		gap: 10px;
		padding: 7px 9px;
		border: 1px solid transparent;
		border-radius: 6px;
		background: transparent;
		color: #a7aaa0;
		cursor: pointer;
		font-size: 11px;
		text-align: left;
		transition:
			background 140ms ease,
			border-color 140ms ease,
			color 140ms ease;
	}

	.part-buttons button:hover,
	.part-buttons button.selected {
		border-color: rgba(211, 243, 107, 0.2);
		background: rgba(211, 243, 107, 0.08);
		color: #e6e8df;
	}

	.part-index {
		color: #777b70;
		font-size: 9px;
		font-variant-numeric: tabular-nums;
	}

	.selected .part-index,
	.part-arrow {
		color: #d3f36b;
	}

	.part-arrow {
		margin-left: auto;
		opacity: 0;
	}

	.part-buttons button:hover .part-arrow,
	.part-buttons button.selected .part-arrow {
		opacity: 1;
	}

	.part-details {
		margin-top: 21px;
		padding: 17px 0 0;
		border-top: 1px solid rgba(240, 241, 235, 0.1);
	}

	.part-details h3 {
		margin: 9px 0;
		color: #d3f36b;
		font-size: 15px;
		font-weight: 600;
	}

	.part-details > p:not(.eyebrow) {
		margin: 0;
		color: #a7aaa0;
		font-size: 11px;
		line-height: 1.75;
	}

	.part-details ul {
		display: grid;
		gap: 7px;
		margin: 13px 0 0;
		padding: 0;
		list-style: none;
	}

	.part-details li {
		position: relative;
		padding-left: 13px;
		color: #c9cdc1;
		font-size: 10px;
	}

	.part-details li::before {
		position: absolute;
		top: 0;
		left: 0;
		color: #d3f36b;
		content: '·';
	}

	@media (max-width: 900px) {
		.structure-viewer {
			grid-template-columns: minmax(0, 1fr) 270px;
		}
	}

	@media (max-width: 720px) {
		.structure-viewer {
			grid-template-columns: 1fr;
		}

		.model-viewport {
			min-height: 480px;
		}

		.component-panel {
			border-top: 1px solid rgba(240, 241, 235, 0.12);
			border-left: 0;
		}

		.part-buttons {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.part-buttons button {
			justify-content: center;
			gap: 7px;
		}
	}

	@media (max-width: 480px) {
		.viewer-toolbar {
			align-items: flex-start;
			flex-direction: column;
		}

		.viewer-actions {
			width: 100%;
			justify-content: space-between;
		}

		.orbit-hint {
			text-align: left;
		}

		.model-viewport {
			min-height: 390px;
		}

		.component-panel {
			padding: 21px 15px;
		}

		.part-buttons {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
