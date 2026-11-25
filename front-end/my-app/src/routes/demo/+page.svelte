<script>
	import DubbedVideoPlayer from '#lib/DubbedVideoPlayer.svelte';
	import { t } from '#lib/site-preferences.svelte.js';

	const demoVideo = '/video/IoT.mp4';
</script>

<svelte:head>
	<title>{t('demo.title')} — ARMbot</title>
	<meta name="description" content={t('demo.meta')} />
</svelte:head>

<main class="demo-page">
	<div class="page-heading">
		<div>
			<p class="eyebrow">{t('demo.eyebrow')}</p>
			<h1>{t('demo.title')}<span>.</span></h1>
			<p class="description">{t('demo.description')}</p>
		</div>
		<a class="back-link" href="/">{t('demo.back')}</a>
	</div>

	<section class="demo-panel" aria-label={t('demo.aria')}>
		<div class="panel-topline">
			<span><i></i> {t('demo.player')}</span>
			<span>{t('demo.local')}</span>
		</div>
		<DubbedVideoPlayer src={demoVideo} />
		<p class="demo-note">
			{t('demo.requirement')} <code>GEMINI_API_KEY</code>
		</p>
	</section>

	<div class="demo-footer">
		<span>{t('demo.realtime')}</span>
		<a href="/structure">{t('demo.exploreStructure')} <span>↗</span></a>
		<a href="/working-steps">{t('demo.exploreSteps')} <span>↗</span></a>
	</div>
</main>

<style>
	.demo-page {
		width: min(1120px, calc(100% - 48px));
		min-height: calc(100vh - 155px);
		margin: 0 auto;
		padding: 76px 0 80px;
	}

	.page-heading {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 30px;
		margin-bottom: 34px;
	}

	.eyebrow {
		margin: 0 0 12px;
		color: #a7aaa0;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.16em;
	}

	h1 {
		margin: 0;
		font-size: clamp(48px, 7vw, 78px);
		font-weight: 600;
		letter-spacing: -0.075em;
		line-height: 1;
	}

	h1 span {
		color: #d3f36b;
	}

	.description {
		max-width: 580px;
		margin: 16px 0 0;
		color: #a7aaa0;
		font-size: 14px;
		line-height: 1.8;
	}

	.back-link {
		margin-bottom: 4px;
		color: #a7aaa0;
		font-size: 12px;
		text-decoration: none;
		white-space: nowrap;
	}

	.back-link:hover {
		color: #d3f36b;
	}

	.demo-panel {
		padding: 12px 20px 20px;
		border: 1px solid rgba(240, 241, 235, 0.13);
		border-radius: 12px;
		background:
			radial-gradient(ellipse at 50% 0, rgba(211, 243, 107, 0.05), transparent 58%),
			#151713;
	}

	.panel-topline {
		min-height: 34px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #777b70;
		font-size: 9px;
		letter-spacing: 0.15em;
	}

	.panel-topline i {
		display: inline-block;
		width: 6px;
		height: 6px;
		margin-right: 7px;
		border-radius: 50%;
		background: #d3f36b;
	}

	.demo-panel :global(.player-wrapper) {
		max-width: 100%;
		margin: 10px auto 0;
	}

	.demo-note {
		margin: 14px 0 0;
		color: #82867b;
		font-size: 11px;
		text-align: center;
	}

	code {
		color: #d3f36b;
	}

	.demo-footer {
		display: flex;
		justify-content: space-between;
		gap: 18px;
		margin-top: 20px;
		color: #777b70;
		font-size: 9px;
		letter-spacing: 0.13em;
	}

	.demo-footer a {
		color: #c4d994;
		font-size: 11px;
		letter-spacing: 0;
		text-decoration: none;
	}

	.demo-footer a:hover {
		color: #e0ff7e;
	}

	.demo-footer a span {
		margin-left: 6px;
	}

	@media (max-width: 640px) {
		.demo-page {
			width: calc(100% - 32px);
			padding: 48px 0 56px;
		}

		.page-heading {
			display: block;
		}

		.back-link {
			display: inline-block;
			margin-top: 18px;
		}

		.demo-panel {
			padding: 10px 10px 16px;
		}

		.demo-footer {
			flex-direction: column;
		}
	}
</style>
