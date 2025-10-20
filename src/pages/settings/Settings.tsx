import { Radio } from "antd";
import { CardContainer } from "../../components/cardContainer/CardContainer";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../utils/i18n/i18n";

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

    return (
        <div className="flex flex-col gap-4 pt-[56px] p-4">
            <CardContainer>
                <div className="flex justify-between items-center">
                    <p>{t("SETTINGS.LANGUAGE")}</p>
                    <Radio.Group value={language} onChange={(e) => onChange(e.target.value)}>
                        <Radio.Button value="en" checked={language === "en"}>
                            EN
                        </Radio.Button>
                        <Radio.Button value="es" checked={language === "es"}>
                            ES
                        </Radio.Button>
                    </Radio.Group>
                </div>
            </CardContainer>
        </div>
    );
};
