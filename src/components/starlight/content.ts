import { getCollection } from 'astro:content';
// import { isEnglishEntry, isKoreanEntry, isRecipeEntry, isTutorialEntry } from './content.config';

// https://github.com/withastro/docs/blob/129ba2300654392f2b7aeedd43b0137b24cfdef9/src/content.ts

export const allPages = await getCollection('docs');
// export const tutorialPages = allPages.filter(isTutorialEntry);
// export const recipePages = allPages.filter(isRecipeEntry);
// export const englishPages = allPages.filter(isEnglishEntry);