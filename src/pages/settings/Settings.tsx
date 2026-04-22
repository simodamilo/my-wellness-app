import { HabitsCatalog } from "../../components/habitsCatalog/HabitsCatalog";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { IoLogOutOutline } from "react-icons/io5";
import i18n from "../../utils/i18n/i18n";
import { supabase } from "../../store/supabaseClient";

export const Settings = () => {
    const { t } = useTranslation();
    const [language, setLanguage] = useState("en");

    useEffect(() => {
        const lang = localStorage.getItem("lang") || "en";
        setLanguage(lang);
        i18n.changeLanguage(lang);
    }, []);

    const onChange = (lang: string) => {
        setLanguage(lang);
        localStorage.setItem("lang", lang);
        i18n.changeLanguage(lang);
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Logout error:", error.message);
        }
    };

    const languages = [
        { id: "en", label: t("SETTINGS.LANGUAGES.ENGLISH") },
        { id: "es", label: t("SETTINGS.LANGUAGES.SPANISH") },
    ];

    return (
        <div className="flex flex-col gap-4 p-4 pb-24">
            <section className="bg-white/70 backdrop-blur-md rounded-3xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                        {t("SETTINGS.LANGUAGE")}
                    </span>
                    <div className="relative flex bg-white/60 border border-white/70 rounded-full p-0.5">
                        <motion.div
                            className="absolute top-0.5 bottom-0.5 bg-[#c2185b] rounded-full"
                            initial={false}
                            animate={{
                                left: `calc(${languages.findIndex((l) => l.id === language) * 50}% + 2px)`,
                            }}
                            style={{ width: "calc(50% - 4px)" }}
                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                        {languages.map((lang) => {
                            const isActive = language === lang.id;
                            return (
                                <button
                                    key={lang.id}
                                    onClick={() => onChange(lang.id)}
                                    className={`relative z-10 px-4 py-1 rounded-full text-xs font-semibold transition-colors ${
                                        isActive ? "text-white" : "text-gray-600"
                                    }`}
                                >
                                    {lang.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-white/70 backdrop-blur-md rounded-3xl shadow-sm p-4">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                    {t("SETTINGS.HABITS_CATALOG.TITLE")}
                </h2>
                <HabitsCatalog />
            </section>

            <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 self-center mt-4 px-6 py-2.5 rounded-full text-sm font-semibold text-[#c2185b] bg-white/70 backdrop-blur-md border border-[#c2185b]/25 shadow-sm hover:bg-white transition-colors"
            >
                <IoLogOutOutline size={16} />
                {t("SETTINGS.LOGOUT_BUTTON")}
            </motion.button>
        </div>
    );
};
