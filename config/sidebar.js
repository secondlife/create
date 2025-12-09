import enLabels from '../src/content/i18n/nav/en.js';

const translations = Object.entries(
	import.meta.glob('../src/content/i18n/nav/*.js', { eager: true })
)
.map(([path, module]) => [path.split('/').pop()?.replace('.js', ''), module.default])
.reduce(
	(translations, [lang, dict]) => {
		for(const key in dict) {
			translations[key] ??= {};
			translations[key][lang] = dict[key];
		}
		return translations;
	},
	{}
);

export function portal(key, portal) {
	if(!enLabels[key]) return new Error(`Missing label for sidebar portal key: ${key}`);
	return {
		label: enLabels[key],
		translations: translations[key],
		...portal,
	};
}

export function tab(key, tab) {
	if(!enLabels[key]) return new Error(`Missing label for sidebar tab key: ${key}`);
	return {
		label: enLabels[key],
		translations: translations[key],
		...tab,
	};
}

export function group(key, group) {
	if(!enLabels[key]) return new Error(`Missing label for sidebar group key: ${key}`);
	return {
		label: enLabels[key],
		translations: translations[key],
		...group,
	};
}