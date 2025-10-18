import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { BsEmojiHeartEyes, BsEmojiSmile, BsEmojiNeutral, BsEmojiAstonished, BsEmojiFrown } from "react-icons/bs";

export const Mood = () => {
    const { t } = useTranslation();

    const singleMood = (label: string, icon: ReactNode) => {
        return (
            <div className="flex flex-col gap-2 items-center">
                {icon}
                <p className="text-xs">{label}</p>
            </div>
        );
    };
    return (
        <div className="flex flex-col items-center gap-4 font-bold">
            <p>Select your mood</p>
            <div className="grid grid-cols-5 w-full max-w-[600px]">
                <div>{singleMood(t("INPUTS.MOODS.HAPPY"), <BsEmojiHeartEyes size={24} />)}</div>
                <div>{singleMood(t("INPUTS.MOODS.CALM"), <BsEmojiSmile size={24} />)}</div>
                <div>{singleMood(t("INPUTS.MOODS.NEUTRAL"), <BsEmojiNeutral size={24} />)}</div>
                <div>{singleMood(t("INPUTS.MOODS.THOUGHTFUL"), <BsEmojiAstonished size={24} />)}</div>
                <div>{singleMood(t("INPUTS.MOODS.SAD"), <BsEmojiFrown size={24} />)}</div>
            </div>
        </div>
    );
};
