<script>
	import StructureModelViewer from '#lib/StructureModelViewer.svelte';
	import { t } from '#lib/site-preferences.svelte.js';

	let selectedPart = $state('base');
</script>

<svelte:head>
	<title>{t('nav.structure')} — ARMbot</title>
	<meta name="description" content={t('structure.meta')} />
</svelte:head>

<main class="structure-page">
	<section class="structure-heading">
		<div>
			<p class="eyebrow"><span></span> {t('structure.eyebrow')}</p>
			<h1>{t('structure.heading1')}<br /><em>{t('structure.heading2')}</em></h1>
		</div>
		<div class="heading-aside">
			<p>{t('structure.description')}</p>
			<a href="/working-steps">{t('structure.stepsLink')} <span>↗</span></a>
		</div>
	</section>

	<StructureModelViewer bind:selectedPart />
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

	.structure-heading .eyebrow span {
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
		max-width: 390px;
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

	@media (max-width: 800px) {
		.structure-page {
			width: min(720px, calc(100% - 40px));
		}

		.structure-heading {
			display: block;
		}

		.heading-aside {
			margin-top: 21px;
		}
	}

	@media (max-width: 640px) {
		.structure-page {
			width: calc(100% - 32px);
			padding: 48px 0 55px;
		}
	}
</style>
