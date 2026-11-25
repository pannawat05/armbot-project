<svelte:head>
	<title>ARMbot — Intelligent Pick &amp; Place</title>
	<meta
		name="description"
		content="ARMbot แขนกล 6 แกนสำหรับงานหยิบจับอัตโนมัติด้วย Computer Vision และระบบควบคุมแบบกระจาย"
	/>
</svelte:head>

<main class="home">
	<section class="hero">
		<div class="hero-copy">
			<p class="eyebrow"><span class="live-dot"></span> ROBOTICS · COMPUTER VISION · AUTOMATION</p>
			<h1>See it.<br />Think it.<br /><span>Pick it.</span></h1>
			<p class="intro">
				ARMbot แขนกล 6 แกนที่เชื่อมการมองเห็น การตัดสินใจ และการเคลื่อนไหว
				ให้เป็นระบบหยิบจับอัตโนมัติ ตั้งแต่กล้องจนถึงปลาย gripper
			</p>

			<div class="hero-actions">
				<a class="button button-primary" href="/demo">เปิดหน้า Demo <span>↗</span></a>
				<a class="button button-quiet" href="/structure">สำรวจ Structure <span>↗</span></a>
			</div>

			<div class="hero-specs" aria-label="Project highlights">
				<div><strong>06</strong><span>DEGREES OF FREEDOM</span></div>
				<div><strong>CV</strong><span>OBJECT DETECTION</span></div>
				<div><strong>RPi</strong><span>EDGE CONTROL</span></div>
			</div>
		</div>

		<div class="hero-visual">
			<img src="/images/armbot-demo.png" alt="ต้นแบบ ARMbot แขนกลพร้อมกล้องและเซนเซอร์" />
			<div class="image-shade"></div>
			<div class="visual-label">
				<span>01 / WORKING PROTOTYPE</span>
				<strong>Built to see. Made to move.</strong>
			</div>
			<div class="visual-coordinate">6-DOF PICK &amp; PLACE</div>
		</div>
	</section>

	<section class="project-section">
		<div class="section-heading">
			<div>
				<p class="eyebrow">THE SYSTEM</p>
				<h2>จากการมองเห็น<br /><span>สู่การลงมือทำ</span></h2>
			</div>
			<p class="section-note">
				ระบบต้นแบบสำหรับตรวจจับวัตถุและจัดการงานหยิบ-วาง
				ออกแบบให้แต่ละส่วนสื่อสารและตรวจสอบสถานะได้
			</p>
		</div>

		<div class="system-grid">
			<article class="system-card">
				<span class="card-index">01</span>
				<div class="card-icon" aria-hidden="true">◎</div>
				<h3>Computer Vision</h3>
				<p>ใช้กล้องและโมเดล YOLO ตรวจจับวัตถุ ก่อนแปลงผลเป็นเป้าหมายสำหรับแขนกล</p>
				<span class="card-tag">CAMERA · YOLO</span>
			</article>

			<article class="system-card">
				<span class="card-index">02</span>
				<div class="card-icon" aria-hidden="true">⌁</div>
				<h3>Motion Control</h3>
				<p>ควบคุมเซอร์โว 6 แกนผ่าน PCA9685 พร้อม C++ daemon และลำดับงาน pick &amp; place</p>
				<span class="card-tag">6-DOF · PCA9685</span>
			</article>

			<article class="system-card">
				<span class="card-index">03</span>
				<div class="card-icon" aria-hidden="true">↗</div>
				<h3>Connected Workflow</h3>
				<p>Python pipeline และ MQTT เชื่อมงานตรวจจับ คิวหยิบจับ และหน้า dashboard</p>
				<span class="card-tag">PYTHON · MQTT</span>
			</article>
		</div>
	</section>

	<section class="demo-callout">
		<div>
			<p class="eyebrow">TRY IT YOURSELF</p>
			<h2>ทดลองใช้งาน<br /><span>และสำรวจ ARMbot</span></h2>
		</div>
		<p>ทดลองเล่นวิดีโอ สำรวจชิ้นส่วน 3D หรือดูภาพขั้นตอนการทำงานจริง</p>
		<div class="callout-actions">
			<a href="/demo">หน้า Demo <span>↗</span></a>
			<a href="/structure">Structure <span>↗</span></a>
			<a href="/working-steps">Working Steps <span>↗</span></a>
		</div>
	</section>
</main>

<style>
	.home {
		width: min(1240px, calc(100% - 48px));
		margin: 0 auto;
		padding: 42px 0 90px;
	}

	.hero {
		min-height: 570px;
		display: grid;
		grid-template-columns: 0.88fr 1.12fr;
		align-items: stretch;
		gap: 30px;
	}

	.hero-copy {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 26px 0 34px;
	}

	.eyebrow {
		margin: 0;
		color: #a7aaa0;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.16em;
		line-height: 1.6;
	}

	.live-dot {
		display: inline-block;
		width: 7px;
		height: 7px;
		margin-right: 7px;
		border-radius: 50%;
		background: #d3f36b;
		box-shadow: 0 0 12px rgba(211, 243, 107, 0.75);
	}

	h1 {
		margin: 27px 0 22px;
		font-size: clamp(62px, 8vw, 106px);
		font-weight: 650;
		letter-spacing: -0.085em;
		line-height: 0.91;
	}

	h1 span,
	.section-heading h2 span,
	.demo-callout h2 span {
		color: #d3f36b;
	}

	.intro {
		max-width: 430px;
		margin: 0;
		color: #a7aaa0;
		font-size: 15px;
		line-height: 1.9;
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 28px;
	}

	.button {
		min-height: 46px;
		padding: 0 16px;
		display: inline-flex;
		align-items: center;
		gap: 14px;
		border: 1px solid transparent;
		border-radius: 7px;
		font-size: 12px;
		font-weight: 700;
		text-decoration: none;
		transition: transform 160ms ease, background 160ms ease;
	}

	.button:hover {
		transform: translateY(-2px);
	}

	.button-primary {
		background: #d3f36b;
		color: #10120f;
	}

	.button-primary:hover {
		background: #e0ff7e;
	}

	.button-quiet {
		border-color: rgba(240, 241, 235, 0.17);
		color: #f0f1eb;
	}

	.button-quiet:hover {
		background: rgba(240, 241, 235, 0.07);
	}

	.hero-specs {
		display: flex;
		gap: 26px;
		margin-top: 42px;
		padding-top: 18px;
		border-top: 1px solid rgba(240, 241, 235, 0.12);
	}

	.hero-specs div {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.hero-specs strong {
		color: #f0f1eb;
		font-size: 17px;
		font-weight: 600;
		letter-spacing: -0.04em;
	}

	.hero-specs span {
		color: #777b70;
		font-size: 8px;
		letter-spacing: 0.12em;
	}

	.hero-visual {
		position: relative;
		min-height: 540px;
		overflow: hidden;
		border: 1px solid rgba(240, 241, 235, 0.12);
		border-radius: 12px;
		background: #20231d;
	}

	.hero-visual img,
	.image-shade {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.hero-visual img {
		object-fit: cover;
		object-position: 63% center;
		filter: saturate(0.78) contrast(1.05);
	}

	.image-shade {
		background:
			linear-gradient(180deg, rgba(16, 18, 15, 0.05) 45%, rgba(16, 18, 15, 0.84) 100%),
			linear-gradient(90deg, rgba(16, 18, 15, 0.06), transparent 55%);
	}

	.visual-label {
		position: absolute;
		bottom: 24px;
		left: 25px;
		display: flex;
		flex-direction: column;
		gap: 7px;
	}

	.visual-label span,
	.visual-coordinate {
		color: rgba(240, 241, 235, 0.66);
		font-size: 9px;
		letter-spacing: 0.16em;
	}

	.visual-label strong {
		font-size: 18px;
		font-weight: 500;
		letter-spacing: -0.03em;
	}

	.visual-coordinate {
		position: absolute;
		top: 20px;
		right: 20px;
		padding: 8px 10px;
		border: 1px solid rgba(240, 241, 235, 0.3);
		border-radius: 5px;
		backdrop-filter: blur(6px);
	}

	.project-section {
		padding: 106px 0 80px;
		border-top: 1px solid rgba(240, 241, 235, 0.1);
	}

	.section-heading {
		display: flex;
		justify-content: space-between;
		align-items: end;
		gap: 32px;
		margin-bottom: 35px;
	}

	.section-heading h2,
	.demo-callout h2 {
		margin: 16px 0 0;
		font-size: clamp(34px, 5vw, 54px);
		font-weight: 550;
		letter-spacing: -0.065em;
		line-height: 1.08;
	}

	.section-heading h2 span,
	.demo-callout h2 span {
		color: #93988b;
	}

	.section-note {
		max-width: 370px;
		margin: 0 0 4px;
		color: #90948a;
		font-size: 13px;
		line-height: 1.8;
	}

	.system-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		border: 1px solid rgba(240, 241, 235, 0.12);
		border-radius: 10px;
		overflow: hidden;
	}

	.system-card {
		position: relative;
		min-height: 244px;
		padding: 28px;
		border-right: 1px solid rgba(240, 241, 235, 0.12);
		background: #151713;
	}

	.system-card:last-child {
		border-right: 0;
	}

	.card-index {
		position: absolute;
		top: 28px;
		right: 28px;
		color: #6d7167;
		font-size: 10px;
		letter-spacing: 0.1em;
	}

	.card-icon {
		width: 40px;
		height: 40px;
		display: grid;
		place-items: center;
		margin-bottom: 25px;
		border: 1px solid rgba(211, 243, 107, 0.35);
		border-radius: 9px;
		color: #d3f36b;
		font-size: 24px;
	}

	.system-card h3 {
		margin: 0 0 10px;
		font-size: 16px;
		font-weight: 600;
		letter-spacing: -0.025em;
	}

	.system-card p {
		max-width: 300px;
		min-height: 46px;
		margin: 0;
		color: #92968c;
		font-size: 12px;
		line-height: 1.75;
	}

	.card-tag {
		display: inline-block;
		margin-top: 18px;
		color: #c4d994;
		font-size: 9px;
		letter-spacing: 0.13em;
	}

	.demo-callout {
		display: grid;
		grid-template-columns: 1.1fr 0.8fr auto;
		align-items: center;
		gap: 35px;
		margin-bottom: 30px;
		padding: 35px;
		border: 1px solid rgba(211, 243, 107, 0.28);
		border-radius: 10px;
		background:
			radial-gradient(ellipse at 2% 2%, rgba(211, 243, 107, 0.09), transparent 50%),
			#151713;
	}

	.demo-callout h2 {
		font-size: clamp(29px, 4vw, 42px);
	}

	.demo-callout h2 span {
		color: #d3f36b;
	}

	.demo-callout > p {
		margin: 0;
		color: #92968c;
		font-size: 12px;
		line-height: 1.8;
	}

	.callout-actions {
		display: flex;
		flex-direction: column;
		gap: 11px;
	}

	.callout-actions a {
		color: #f0f1eb;
		font-size: 12px;
		text-decoration: none;
		white-space: nowrap;
	}

	.callout-actions a span {
		margin-left: 9px;
		color: #d3f36b;
	}

	@media (max-width: 900px) {
		.hero {
			min-height: initial;
			grid-template-columns: 1fr 1fr;
			gap: 20px;
		}

		.hero-visual {
			min-height: 500px;
		}

		.hero-specs {
			gap: 17px;
		}

		.demo-callout {
			grid-template-columns: 1fr 1fr;
		}

		.callout-actions {
			grid-column: 2;
			flex-direction: row;
		}
	}

	@media (max-width: 640px) {
		.home {
			width: calc(100% - 32px);
			padding: 22px 0 60px;
		}

		.hero {
			grid-template-columns: 1fr;
			gap: 23px;
		}

		.hero-copy {
			padding: 26px 0 0;
		}

		h1 {
			margin: 20px 0 16px;
			font-size: clamp(60px, 17vw, 82px);
		}

		.intro {
			font-size: 13px;
		}

		.hero-specs {
			margin-top: 27px;
		}

		.hero-visual {
			min-height: 340px;
		}

		.project-section {
			padding: 72px 0 50px;
		}

		.section-heading {
			display: block;
		}

		.section-note {
			margin-top: 18px;
		}

		.system-grid {
			grid-template-columns: 1fr;
		}

		.system-card {
			min-height: initial;
			padding: 23px;
			border-right: 0;
			border-bottom: 1px solid rgba(240, 241, 235, 0.12);
		}

		.system-card:last-child {
			border-bottom: 0;
		}

		.card-icon {
			margin-bottom: 18px;
		}

		.system-card p {
			min-height: initial;
		}

		.demo-callout {
			grid-template-columns: 1fr;
			gap: 20px;
			padding: 24px;
		}

		.callout-actions {
			grid-column: auto;
		}
	}
</style>
