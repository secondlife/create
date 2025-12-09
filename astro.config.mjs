// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import fs from 'node:fs';
import { fetchDefinitions, OUTPUT_PATH } from './scripts/fetch-definitions.js';
import { sidebar } from './astro.sidebar.js';


// Ensure LSL definitions are available
if (!fs.existsSync(OUTPUT_PATH)) {
	console.log('LSL definitions not found, fetching from GitHub...');
	await fetchDefinitions();
}


// Load textmate grammar for LSL 
const lslLang = JSON.parse(
	fs.readFileSync(new URL('./src/definitions/lsl.tmLanguage.json', import.meta.url), 'utf-8')
)


// https://astro.build/config
export default defineConfig({
	site: 'https://create.secondlife.com',
	redirects: {
		'/': '/script/',
		'/reference/': '/reference/categories/',
	},
	integrations: [
		starlight({
			title: 'Second Life Content Creation',
			favicon: '/favicon.svg',
			defaultLocale: 'root',
			locales: {
				root: { label: 'English', lang: 'en' },
			},
			social: [
				{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/secondlifeofficial' },
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/secondlife/create' },
			],
			logo: { src: './src/assets/sl-logo.svg' },
			
			tableOfContents: false,
			sidebar,
			components: {
				Sidebar: './src/components/starlight/Sidebar.astro',
			},
			customCss: [
				'./src/styles/custom.css',
			],
			editLink: {
				baseUrl: 'https://github.com/secondlife/create/edit/main/',
			},
			
			routeMiddleware: './config/middleware.js',
			expressiveCode: {
				shiki: {
					langs: [lslLang],
				},
			},
		}),
	],
});
