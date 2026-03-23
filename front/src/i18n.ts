"use client";

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import the raw JSON files
import enTranslation from './locales/en.json';
import faTranslation from './locales/fa.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslation },
            fa: { translation: faTranslation }
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;