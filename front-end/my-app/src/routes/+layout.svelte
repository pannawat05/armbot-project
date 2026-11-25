<script>
	import { onMount } from 'svelte';
	import '#lib/site-theme.css';
	import favicon from '#lib/assets/favicon.svg';
	import { languageOptions, preferences, t } from '#lib/site-preferences.svelte.js';

	let { children } = $props();
	let menuOpen = $state(false);
	let preferencesReady = $state(false);

	onMount(() => {
		try {
			const savedLocale = window.localStorage.getItem('armbot-locale');
			const savedTheme = window.localStorage.getItem('armbot-theme');
			if (languageOptions.some((language) => language.value === savedLocale)) {
				preferences.locale = savedLocale;
			}
			if (savedTheme === 'light' || savedTheme === 'dark') {
				preferences.theme = savedTheme;
			}
		} catch (error) {
			console.warn('Unable to load saved site preferences:', error);
		}
		preferencesReady = true;
	});

	$effect(() => {
		if (!preferencesReady || typeof document === 'undefined') return;
		document.documentElement.lang = preferences.locale;
		document.documentElement.dataset.theme = preferences.theme;
		try {
			window.localStorage.setItem('armbot-locale', preferences.locale);
			window.localStorage.setItem('armbot-theme', preferences.theme);
		} catch (error) {
			console.warn('Unable to save site preferences:', error);
		}
	});

	function closeMenu() {
		menuOpen = false;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content={preferences.theme === 'dark' ? '#10120f' : '#f6f7f2'} />
</svelte:head>

<div class="site-shell">
	<header class="site-header">
		<div class="header-inner">
			<a class="brand" href="/" aria-label={t('brand.home')} onclick={closeMenu}>
				<span class="brand-mark">A</span>
				<span>ARM<span class="brand-light">BOT</span></span>
			</a>

			<nav id="site-navigation" class:open={menuOpen} aria-label={t('nav.label')}>
				<a href="/" onclick={closeMenu}>{t('nav.home')}</a>
				<a href="/demo" onclick={closeMenu}>{t('nav.demo')}</a>
				<a href="/structure" onclick={closeMenu}>{t('nav.structure')}</a>
				<a href="/working-steps" onclick={closeMenu}>{t('nav.steps')}</a>
				<a
					class="mobile-github"
					href="https://github.com/pannawat05/ARMbot"
					target="_blank"
					rel="noreferrer"
					onclick={closeMenu}
				>
					{t('nav.github')} ↗
				</a>
			</nav>

			<div class="header-tools">
				<label class="language-picker">
					<span class="visually-hidden">{t('language.label')}</span>
					<select bind:value={preferences.locale} aria-label={t('language.label')}>
						{#each languageOptions as language (language.value)}
							<option value={language.value}>{language.label}</option>
						{/each}
					</select>
				</label>
				<button
					class="theme-toggle"
					type="button"
					aria-label={preferences.theme === 'dark' ? t('theme.light') : t('theme.dark')}
					title={preferences.theme === 'dark' ? t('theme.light') : t('theme.dark')}
					onclick={() => (preferences.theme = preferences.theme === 'dark' ? 'light' : 'dark')}
				>
					<span aria-hidden="true">{preferences.theme === 'dark' ? '☼' : '☾'}</span>
				</button>
				<button
					class="menu-toggle"
					type="button"
					aria-label={menuOpen ? t('menu.close') : t('menu.open')}
					aria-expanded={menuOpen}
					aria-controls="site-navigation"
					onclick={() => (menuOpen = !menuOpen)}
				>
					<span></span>
					<span></span>
					<span></span>
				</button>
			</div>

			<a
				class="github-link"
				href="https://github.com/pannawat05/ARMbot"
				target="_blank"
				rel="noreferrer"
			>
				{t('nav.github')} <span aria-hidden="true">↗</span>
			</a>
		</div>
	</header>

	{@render children()}

	<footer class="site-footer">
		<span>{t('footer.tagline')}</span>
		<a href="https://github.com/pannawat05/ARMbot" target="_blank" rel="noreferrer">
			{t('footer.source')}
		</a>
	</footer>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(html) {
		background: #10120f;
		scroll-behavior: smooth;
	}

	:global(body) {
		margin: 0;
		background: #10120f;
		color: #f0f1eb;
		font-family:
			Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
		-webkit-font-smoothing: antialiased;
	}

	:global(button),
	:global(a) {
		font: inherit;
	}

	.site-shell {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.site-header {
		position: relative;
		z-index: 20;
		border-bottom: 1px solid rgba(240, 241, 235, 0.1);
		background: rgba(16, 18, 15, 0.94);
	}

	.header-inner {
		width: min(1240px, calc(100% - 48px));
		height: 76px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 30px;
		position: relative;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		color: #f0f1eb;
		font-size: 15px;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-decoration: none;
		white-space: nowrap;
	}

	.brand-mark {
		width: 30px;
		height: 30px;
		display: grid;
		place-items: center;
		background: #d3f36b;
		border-radius: 9px;
		color: #10120f;
		font-size: 16px;
		letter-spacing: -0.08em;
	}

	.brand-light {
		color: #9da196;
		font-weight: 500;
	}

	nav {
		display: flex;
		align-items: center;
		gap: clamp(18px, 3vw, 40px);
	}

	nav a,
	.github-link {
		color: #a7aaa0;
		font-size: 13px;
		text-decoration: none;
		transition: color 160ms ease;
		white-space: nowrap;
	}

	nav a:hover,
	.github-link:hover {
		color: #d3f36b;
	}

	.mobile-github,
	.menu-toggle {
		display: none;
	}

	.header-tools {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-left: auto;
	}

	.language-picker select {
		min-height: 36px;
		padding: 0 8px;
		border: 1px solid rgba(240, 241, 235, 0.2);
		border-radius: 8px;
		background: transparent;
		color: #f0f1eb;
		font-size: 12px;
		cursor: pointer;
	}

	.language-picker option {
		background: #151713;
		color: #f0f1eb;
	}

	.theme-toggle,
	.menu-toggle {
		width: 36px;
		height: 36px;
		display: inline-grid;
		place-items: center;
		border: 1px solid rgba(240, 241, 235, 0.2);
		border-radius: 8px;
		background: transparent;
		color: #f0f1eb;
		font-size: 18px;
		cursor: pointer;
	}

	.theme-toggle:hover,
	.menu-toggle:hover {
		border-color: rgba(211, 243, 107, 0.55);
		color: #d3f36b;
	}

	.menu-toggle {
		display: none;
		align-content: center;
		gap: 4px;
	}

	.menu-toggle span {
		width: 16px;
		height: 2px;
		display: block;
		border-radius: 2px;
		background: currentColor;
		transition: transform 160ms ease, opacity 160ms ease;
	}

	.menu-toggle[aria-expanded='true'] span:first-child {
		transform: translateY(6px) rotate(45deg);
	}

	.menu-toggle[aria-expanded='true'] span:nth-child(2) {
		opacity: 0;
	}

	.menu-toggle[aria-expanded='true'] span:last-child {
		transform: translateY(-6px) rotate(-45deg);
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.github-link {
		padding: 10px 14px;
		border: 1px solid rgba(240, 241, 235, 0.2);
		border-radius: 8px;
		color: #f0f1eb;
	}

	.github-link span {
		margin-left: 5px;
		color: #d3f36b;
	}

	.site-footer {
		width: min(1240px, calc(100% - 48px));
		margin: auto auto 0;
		padding: 24px 0;
		display: flex;
		justify-content: space-between;
		gap: 16px;
		border-top: 1px solid rgba(240, 241, 235, 0.1);
		color: #777b70;
		font-size: 12px;
	}

	.site-footer a {
		color: #a7aaa0;
		text-decoration: none;
	}

	.site-footer a:hover {
		color: #d3f36b;
	}

	@media (max-width: 760px) {
		.header-inner {
			width: calc(100% - 32px);
			height: auto;
			min-height: 68px;
			gap: 8px;
		}

		.brand {
			font-size: 13px;
			gap: 7px;
			margin-right: auto;
		}

		.brand-mark {
			width: 27px;
			height: 27px;
		}

		nav {
			position: absolute;
			top: calc(100% + 1px);
			right: 0;
			left: 0;
			display: none;
			align-items: stretch;
			gap: 0;
			padding: 8px;
			border: 1px solid rgba(240, 241, 235, 0.14);
			border-radius: 0 0 12px 12px;
			background: #151713;
			box-shadow: 0 16px 30px rgba(0, 0, 0, 0.24);
		}

		nav.open {
			display: flex;
			flex-direction: column;
		}

		nav a {
			padding: 12px;
			font-size: 13px;
		}

		.github-link {
			display: none;
		}

		.mobile-github,
		.menu-toggle {
			display: inline-grid;
		}

		.mobile-github {
			border-top: 1px solid rgba(240, 241, 235, 0.1);
		}

		.header-tools {
			gap: 6px;
		}

		.language-picker select {
			min-height: 36px;
			max-width: 72px;
			padding: 0 5px;
		}

		.site-footer {
			width: calc(100% - 32px);
			flex-direction: column;
			align-items: flex-start;
			font-size: 10px;
		}
	}
</style>
