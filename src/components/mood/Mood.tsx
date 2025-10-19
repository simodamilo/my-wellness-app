import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { BsEmojiHeartEyes, BsEmojiSmile, BsEmojiNeutral, BsEmojiAstonished, BsEmojiFrown } from "react-icons/bs";

export const Mood = () => {
    const { t } = useTranslation();
    const [selectedMood, setSelectedMood] = useState<string | null>(null);

    const singleMood = (value: string, label: string, icon: ReactNode) => {
        return (
            <div className={`flex flex-col gap-2 items-center py-2 rounded-xl ${selectedMood === value && "bg-[#f087b0]"}`} onClick={() => setSelectedMood(value)}>
                {icon}
                <p className="text-xs">{label}</p>
            </div>
        );
    };
    return (
        <div className="flex flex-col items-center gap-2 font-bold">
            <p>{t("INPUTS.MOODS.TITLE")}</p>
            <div className="grid grid-cols-5 w-full max-w-[600px]">
                <div>{singleMood("happy", t("INPUTS.MOODS.HAPPY"), <BsEmojiHeartEyes size={24} />)}</div>
                <div>{singleMood("calm", t("INPUTS.MOODS.CALM"), <BsEmojiSmile size={24} />)}</div>
                <div>{singleMood("neutral", t("INPUTS.MOODS.NEUTRAL"), <BsEmojiNeutral size={24} />)}</div>
                <div>{singleMood("thoughtful", t("INPUTS.MOODS.THOUGHTFUL"), <BsEmojiAstonished size={24} />)}</div>
                <div>{singleMood("sad", t("INPUTS.MOODS.SAD"), <BsEmojiFrown size={24} />)}</div>
            </div>
        </div>
    );
};
