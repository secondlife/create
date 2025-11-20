// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import fs from 'node:fs';
import { fetchDefinitions, OUTPUT_PATH } from './scripts/fetch-definitions.js';

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
	},
	integrations: [
		starlight({
			title: 'Second Life Creation',
			editLink: {
				baseUrl: 'https://github.com/secondlife/create/edit/main/',
			},
			social: [
				{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/secondlifeofficial' },
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/secondlife/create',
				},
			],
			logo: {
				src: './src/assets/sl-logo.svg',
			},
			expressiveCode: {
				shiki: {
					langs: [lslLang],
				},
			},
			customCss: [
				'./src/styles/custom.css',
			],
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'English',
					lang: 'en',
				},
			},
			sidebar: [
				{
					label: 'Script',
					items: [
						{ label: 'Getting Started', slug: 'script' },
						// {
						// 	label: 'Guides',
						// 	autogenerate: { directory: 'script/guides' },
						// },
						// {
						// 	label: 'Recipes',
						// 	autogenerate: { directory: 'script/recipes' },
						// },
						{
							label: 'Learn SLua',
							collapsed: true,
							autogenerate: { directory: 'script/learn-slua' },
						},
						{
							label: 'Reference',
							items: [
								{
									label: 'LSL',
									collapsed: true,
									autogenerate: { directory: 'script/lsl-reference' },
								},
								{
									label: 'SLua',
									collapsed: true,
									autogenerate: { directory: 'script/slua-reference' },
								},
							],
						},
					],
				},
			],
		}),
	],
});
