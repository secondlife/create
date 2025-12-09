// https://github.com/withastro/docs/blob/129ba2300654392f2b7aeedd43b0137b24cfdef9/src/util/path-utils.ts#L16-L17
/** Get a page’s slug, without the language prefix (e.g. `'en/migrate'` => `'migrate'`). */
export const stripLangFromSlug = (slug: string) => slug.split('/').slice(1).join('/');

// https://github.com/withastro/starlight/blob/main/packages/starlight/utils/path.ts#L20C1-L37C2
/** Ensure the passed path does not start with a leading slash. */
export function stripLeadingSlash(href: string) {
	if (href[0] === '/') href = href.slice(1);
	return href;
}

/** Ensure the passed path does not end with a trailing slash. */
export function stripTrailingSlash(href: string) {
	if (href[href.length - 1] === '/') href = href.slice(0, -1);
	return href;
}

/** Ensure the passed path does not start and end with slashes. */
export function stripLeadingAndTrailingSlashes(href: string): string {
	href = stripLeadingSlash(href);
	href = stripTrailingSlash(href);
	return href;
}