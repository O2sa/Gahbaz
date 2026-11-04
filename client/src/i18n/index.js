import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import arCommon from '../locales/ar/common.json'
import enCommon from '../locales/en/common.json'
import arNav from '../locales/ar/nav.json'
import enNav from '../locales/en/nav.json'
import arAuth from '../locales/ar/auth.json'
import enAuth from '../locales/en/auth.json'
import arAdmin from '../locales/ar/admin.json'
import enAdmin from '../locales/en/admin.json'
import arTeacher from '../locales/ar/teacher.json'
import enTeacher from '../locales/en/teacher.json'
import arStudent from '../locales/ar/student.json'
import enStudent from '../locales/en/student.json'
import arChat from '../locales/ar/chat.json'
import enChat from '../locales/en/chat.json'
import arLanding from '../locales/ar/landing.json'
import enLanding from '../locales/en/landing.json'
import arErrors from '../locales/ar/errors.json'
import enErrors from '../locales/en/errors.json'

const resources = {
  ar: {
    common: arCommon,
    nav: arNav,
    auth: arAuth,
    admin: arAdmin,
    teacher: arTeacher,
    student: arStudent,
    chat: arChat,
    landing: arLanding,
    errors: arErrors,
  },
  en: {
    common: enCommon,
    nav: enNav,
    auth: enAuth,
    admin: enAdmin,
    teacher: enTeacher,
    student: enStudent,
    chat: enChat,
    landing: enLanding,
    errors: enErrors,
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
    ns: ['common', 'nav', 'auth', 'admin', 'teacher', 'student', 'chat', 'landing', 'errors'],
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
