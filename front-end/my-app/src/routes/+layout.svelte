<script>
	import favicon from '#lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#10120f" />
</svelte:head>

<div class="site-shell">
	<header class="site-header">
		<div class="header-inner">
			<a class="brand" href="/" aria-label="ARMbot home">
				<span class="brand-mark">A</span>
				<span>ARM<span class="brand-light">BOT</span></span>
			</a>

			<nav aria-label="Main navigation">
				<a href="/">ภาพรวม</a>
				<a href="/demo">Demo</a>
				<a href="/structure">Structure</a>
				<a href="/working-steps">Working Steps</a>
			</nav>

			<a
				class="github-link"
				href="https://github.com/pannawat05/ARMbot"
				target="_blank"
				rel="noreferrer"
			>
				GitHub <span aria-hidden="true">↗</span>
			</a>
		</div>
	</header>

	{@render children()}

	<footer class="site-footer">
		<span>ARMbot · Intelligent pick &amp; place</span>
		<a href="https://github.com/pannawat05/ARMbot" target="_blank" rel="noreferrer">
			ดู source code ↗
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

	@media (max-width: 640px) {
		.header-inner {
			width: calc(100% - 32px);
			height: auto;
			min-height: 68px;
			display: grid;
			grid-template-columns: minmax(0, 1fr) auto;
			gap: 10px 12px;
			padding: 12px 0 10px;
		}

		.brand {
			grid-column: 1;
			grid-row: 1;
			font-size: 13px;
			gap: 7px;
		}

		.brand-mark {
			width: 27px;
			height: 27px;
		}

		nav {
			grid-column: 1 / -1;
			grid-row: 2;
			width: 100%;
			justify-content: space-between;
			gap: 14px;
			overflow-x: auto;
			scrollbar-width: none;
		}

		nav::-webkit-scrollbar {
			display: none;
		}

		nav a {
			flex: 0 0 auto;
			font-size: 11px;
		}

		.github-link {
			grid-column: 2;
			grid-row: 1;
			padding: 8px 10px;
			font-size: 11px;
		}

		.site-footer {
			width: calc(100% - 32px);
			flex-direction: column;
			align-items: flex-start;
			font-size: 10px;
		}
	}
</style>
