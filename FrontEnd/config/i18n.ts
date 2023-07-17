import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translateEN from './lang/en.json';  // English
import translateFR from './lang/fr.json';  // Franch, French
import translateSP from './lang/sp.json';  // spanish, espanol
import translateNE from './lang/ne.json';  // Nederlands, Deutsch
import translateTR from './lang/tr.json';  // Turkish
import translateGR from './lang/gr.json';  // Greek
import translateSR from './lang/sr.json';  // Svenska
import translatePO from './lang/po.json';  // Polski
import translatePT from './lang/pt.json';  // Portuguese
import translateIT from './lang/it.json';  // Italiano
import translateNO from './lang/no.json';  // Norsk
import translateCE from './lang/ce.json';  // Cesky


i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: "English",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      English: {
        translation: translateEN,
      },
      French: {
        translation: translateFR,
      },
      Spanish: {
        translation: translateSP,
      },
      Dutch: {
        translation: translateNE,
      },
      Turkish: {
        translation: translateTR,
      },
      Greek: {
        translation: translateGR,
      },
      Swedish: {
        translation: translateSR,
      },
      Polish: {
        translation: translatePO,
      },
      Portuguese: {
        translation: translatePT,
      },
      Italian: {
        translation: translateIT,
      },
      Norwegian: {
        translation: translateNO,
      },
      Czech: {
        translation: translateCE,
      },
    },
  });

export default i18n;
