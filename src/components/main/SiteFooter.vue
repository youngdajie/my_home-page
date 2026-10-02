<template>
	<footer>
		<div class="footer__info">
			{{ footer.owner }} © {{ copyrightRange() }}
			<template v-for="link in footer.links" :key="link.href">
				<br />
				<a :href="link.href" target="_blank" rel="noopener noreferrer">{{ link.text }}</a>
			</template>
			<br />
			{{ footer.notice }}
			<br />
			{{ footer.browserTip.label }}
			<template v-for="(item, index) in footer.browserTip.entries" :key="item.text"><span v-if="index > 0">，</span><span>{{ item.device }} | </span><a :href="item.href" target="_blank" rel="noopener noreferrer">{{ item.text }}</a></template>
			<br />
			<a :href="footer.ipv6.href" target="_blank" rel="noopener noreferrer">{{ footer.ipv6.text }}</a>
		</div>

		<ul class="footer__badges">
			<li v-for="badge in footer.badges" :key="badge.alt">
				<a :href="badge.href" target="_blank" rel="noopener noreferrer">
					<img :src="badge.src" :alt="badge.alt" :title="badge.alt" loading="lazy" />
				</a>
			</li>
		</ul>
	</footer>
</template>

<script setup lang="ts">
	import { copyrightRange, siteConfig } from '@/site.config'

	const { footer } = siteConfig
</script>

<style scoped>
	footer {
		display: flex;
		color: var(--footer-text-color, var(--main-text-color));
		font-size: 16px;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin: 100px 0 0 0;
		padding: 5px;
	}

	.footer__info {
		width: 60%;
		line-height: 1.7;
	}

	.footer__badges {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		list-style: none;
	}

	.footer__badges a {
		display: block;
		transition: transform 0.3s ease, opacity 0.3s ease;
	}

	.footer__badges a:hover {
		transform: translateY(-3px);
	}

	.footer__badges img {
		width: 122px;
		display: block;
	}

	footer a {
		transition: color 0.3s ease;
	}

	footer a:hover {
		color: var(--accent-blue);
	}

	@media screen and (max-width: 1176px) {
		.footer__info {
			width: 100%;
		}

		.footer__badges {
			display: none;
		}
	}
</style>
