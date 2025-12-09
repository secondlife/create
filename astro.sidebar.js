import { portal, tab, group } from './config/sidebar.js';

export const sidebar = [
	// Scripting Portal
	portal('script', {
		items: [
			tab('script.introduction', {
				autogenerate: { directory: 'script/getting-started' },
			}),
			
			tab('script.guidebook', {
				items: [
					group('script.guidebook.features', { autogenerate: { directory: 'script/features' }}),
					group('script.guidebook.guides', { slug: 'script/guides' }),
					group('script.guidebook.recipes', { slug: 'script/recipes' }),
				]
			}),
			
			tab('script.language', {
				collapsed: false,
				items: [
					group('script.language.slua', {
						autogenerate: { directory: 'script/slua' },
					}),
					group('script.language.lsl', {
						collapsed: true,
						autogenerate: { directory: 'script/lsl' },
					}),
				]
			}),
			
			tab('script.reference', {
				collapsed: false,
				items: [
					group('script.reference.categories', { slug: 'script/reference/categories' }),
					group('script.reference.events', { slug: 'script/reference/events' }),
					group('script.reference.constants', { slug: 'script/reference/constants' }),
					group('script.reference.stdlib', {
						collapsed: false,
						autogenerate: { directory: 'script/reference/standard-library' },
					}),
					group('script.reference.luau', {
						collapsed: false,
						autogenerate: { directory: 'script/reference/luau' },
					}),
					group('script.reference.lsl', {
						collapsed: false,
						items: [
							group('script.reference.lsl.functions', {
								collapsed: true,
								autogenerate: { directory: 'script/reference/lsl/functions' },
							}),
							group('script.reference.lsl.events', {
								collapsed: true,
								autogenerate: { directory: 'script/reference/lsl/events' },
							}),
							group('script.reference.lsl.constants', {
								collapsed: true,
								autogenerate: { directory: 'script/reference/lsl/constants' },
							}),
						]
					}),
				]
			}),
		]
	})
];

/*
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
			
			// autogenerate: { directory: 'script/reference' },
		},
	],
}
*/