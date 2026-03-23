// We use a Next.js feature called 'server-only' to guarantee this never leaks to the client bundle
import 'server-only';

// We dynamically import the JSON files so we only load the language we actually need!
const dictionaries = {
    en: () => import('../locales/en.json').then((module) => module.default),
    fa: () => import('../locales/fa.json').then((module) => module.default),
};

export const getDictionary = async (lang: 'en' | 'fa') => {
    // If someone types a random language in the URL, default to English
    return dictionaries[lang]?.() ?? dictionaries.en();
};