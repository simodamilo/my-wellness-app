import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enJSON from "./en.json";
import esJSON from "./es.json";

const savedLang = localStorage.getItem("lang") || "en";

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: enJSON,
        },
        es: {
            translation: esJSON,
        },
    },
    lng: savedLang,
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
