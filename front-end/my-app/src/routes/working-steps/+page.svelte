<script>
	import { t } from '#lib/site-preferences.svelte.js';

	const frames = [
		{ src: '/images/structure/robot-01.jpg', time: '01:57', duration: 'PT1M57S' },
		{ src: '/images/structure/robot-02.jpg', time: '02:00', duration: 'PT2M' },
		{ src: '/images/structure/robot-03.jpg', time: '02:03', duration: 'PT2M3S' },
		{ src: '/images/structure/robot-04.jpg', time: '02:09', duration: 'PT2M9S' },
		{ src: '/images/structure/robot-05.jpg', time: '02:12', duration: 'PT2M12S' },
		{ src: '/images/structure/robot-06.jpg', time: '02:18', duration: 'PT2M18S' }
	];
</script>

<svelte:head>
	<title>{t('nav.steps')} — ARMbot</title>
	<meta name="description" content={t('steps.meta')} />
</svelte:head>

<main class="structure-page">
	<section class="structure-heading">
		<div>
			<p class="eyebrow"><span></span> {t('steps.eyebrow')}</p>
			<h1>{t('steps.heading1')}<br /><em>{t('steps.heading2')}</em></h1>
		</div>
		<div class="heading-aside">
			<p>{t('steps.description')}</p>
			<a href="/structure">{t('steps.structureLink')} <span>↗</span></a>
		</div>
	</section>

	<section class="frame-gallery" aria-label={t('steps.gallery')}>
		{#each frames as frame, index (frame.src)}
			<figure class="frame-card">
				<a
					class="frame-image"
					href={frame.src}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={t('steps.openImage', { index: index + 1 })}
				>
					<img
						src={frame.src}
						alt={t('steps.imageAlt', { time: frame.time })}
						width="1400"
						height="980"
						loading={index < 2 ? 'eager' : 'lazy'}
						decoding="async"
					/>
					<span class="zoom-label">{t('steps.fullImage')}</span>
				</a>
				<figcaption>
					<span>{t('steps.frame', { index: String(index + 1).padStart(2, '0') })}</span>
					<time datetime={frame.duration}>{t('steps.clip', { time: frame.time })}</time>
				</figcaption>
			</figure>
		{/each}
	</section>
</main>

<style>
	.structure-page {
		width: min(1240px, calc(100% - 48px));
		min-height: calc(100vh - 155px);
		margin: 0 auto;
		padding: 65px 0 74px;
	}

	.structure-heading {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 40px;
		margin-bottom: 36px;
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
		vertical-align: 1px;
	}

	h1 {
		margin: 17px 0 0;
		font-size: clamp(48px, 7vw, 78px);
		font-weight: 600;
		letter-spacing: -0.075em;
		line-height: 0.98;
	}

	h1 em {
		color: #d3f36b;
		font-style: normal;
	}

	.heading-aside {
		max-width: 360px;
		padding-bottom: 4px;
	}

	.heading-aside p {
		margin: 0 0 16px;
		color: #a7aaa0;
		font-size: 13px;
		line-height: 1.8;
	}

	.heading-aside a {
		color: #d3f36b;
		font-size: 11px;
		text-decoration: none;
	}

	.heading-aside a span {
		margin-left: 6px;
	}

	.frame-gallery {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 20px;
	}

	.frame-card {
		min-width: 0;
		margin: 0;
		overflow: hidden;
		border: 1px solid rgba(240, 241, 235, 0.13);
		border-radius: 11px;
		background: #151713;
	}

	.frame-image {
		position: relative;
		display: block;
		overflow: hidden;
		aspect-ratio: 10 / 7;
		background: #121410;
	}

	.frame-image img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 220ms ease;
	}

	.frame-image:hover img,
	.frame-image:focus-visible img {
		transform: scale(1.025);
	}

	.zoom-label {
		position: absolute;
		right: 12px;
		bottom: 12px;
		padding: 7px 10px;
		border: 1px solid rgba(240, 241, 235, 0.2);
		border-radius: 5px;
		background: rgba(18, 20, 16, 0.8);
		color: #f0f1eb;
		font-size: 9px;
		letter-spacing: 0.08em;
	}

	.frame-card figcaption {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 13px 15px;
		color: #a7aaa0;
		font-size: 10px;
	}

	.frame-card figcaption span {
		color: #e6e8df;
		font-weight: 600;
	}

	.frame-card time {
		color: #d3f36b;
		font-variant-numeric: tabular-nums;
	}

	@media (max-width: 800px) {
		.structure-page {
			width: min(680px, calc(100% - 40px));
		}

		.structure-heading {
			display: block;
		}

		.heading-aside {
			margin-top: 21px;
		}

		.frame-gallery {
			gap: 14px;
		}
	}

	@media (max-width: 560px) {
		.structure-page {
			width: calc(100% - 32px);
			padding: 48px 0 55px;
		}

		.frame-gallery {
			grid-template-columns: 1fr;
		}
	}
</style>
