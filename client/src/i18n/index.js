import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import arCommon from '../locales/ar/common.json'
import enCommon from '../locales/en/common.json'
import arNav from '../locales/ar/nav.json'
import enNav from '../locales/en/nav.json'

const resources = {
  ar: {
    common: arCommon,
    nav: arNav,
  },
  en: {
    common: enCommon,
    nav: enNav,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    supportedLngs: ['ar', 'en'],
    defaultNS: 'common',
    ns: ['common', 'nav'],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'gahbaz-language',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n
