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
		'/': '/script/'
	},
	integrations: [
		starlight({
			title: 'Second Life Creation',
			favicon: '/favicon.svg',
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
					label: 'Scripting',
					items: [
						{ label: 'Portal', slug: 'script' },
						{
							label: 'Getting Started',
							collapsed: false,
							autogenerate: { directory: 'script/getting-started' },
						},
						{
							label: 'Features',
							collapsed: true,
							autogenerate: { directory: 'script/features'}
						},
						{ label: 'Guides', slug: 'script/guides' },
						{ label: 'Recipes', slug: 'script/recipes' },
						{
							label: 'SLua Language',
							collapsed: false,
							autogenerate: { directory: 'script/slua' },
						},
						{
							label: 'LSL Language',
							collapsed: true,
							autogenerate: { directory: 'script/lsl' },
						},
						{
							label: 'Reference',
							collapsed: false,
							items: [
								{ label: 'Categories', slug: 'script/reference/categories' },
								{ label: 'Events', slug: 'script/reference/events' },
								{ label: 'Constants', slug: 'script/reference/constants' },
								{
									label: 'Standard Library',
									collapsed: false,
									autogenerate: { directory: 'script/reference/standard-library' },
								},
								{
									label: 'Luau Libraries',
									collapsed: false,
									autogenerate: { directory: 'script/reference/luau' },
								},
								{
									label: 'LSL',
									collapsed: true,
									autogenerate: { directory: 'script/reference/lsl' },
								},
							]
							// autogenerate: { directory: 'script/reference' },
						},
					],
				}
				
				/*{
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
				},*/
			],
		}),
	],
});
