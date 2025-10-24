import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { BsEmojiHeartEyes, BsEmojiSmile, BsEmojiNeutral, BsEmojiAstonished, BsEmojiFrown, BsEmojiTear } from "react-icons/bs";
import type { Input } from "../../store/inputs/types";

interface MoodProps {
    selectedMood?: string;
    setSelectedMood: (updatedFields: Partial<Input>) => void;
}

export const Mood = (props: MoodProps) => {
    const { t } = useTranslation();

    const singleMood = (value: string, label: string, icon: ReactNode) => {
        return (
            <div className={`flex flex-col gap-2 items-center py-2 rounded-xl ${props.selectedMood === value && "bg-[#f087b0]"}`} onClick={() => props.setSelectedMood({ mood: value })}>
                {icon}
                <p className="text-xs">{label}</p>
            </div>
        );
    };
    return (
        <div className="flex flex-col items-center gap-2 font-bold">
            <p>{t("INPUTS.MOODS.TITLE")}</p>
            <div className="grid grid-cols-3 w-full max-w-[600px]">
                <div>{singleMood("happy", t("INPUTS.MOODS.HAPPY"), <BsEmojiHeartEyes size={24} />)}</div>
                <div>{singleMood("calm", t("INPUTS.MOODS.CALM"), <BsEmojiSmile size={24} />)}</div>
                <div>{singleMood("neutral", t("INPUTS.MOODS.NEUTRAL"), <BsEmojiNeutral size={24} />)}</div>
                <div>{singleMood("thoughtful", t("INPUTS.MOODS.THOUGHTFUL"), <BsEmojiAstonished size={24} />)}</div>
                <div>{singleMood("sad", t("INPUTS.MOODS.SAD"), <BsEmojiFrown size={24} />)}</div>
                <div>{singleMood("sensitive", t("INPUTS.MOODS.SENSITIVE"), <BsEmojiTear size={24} />)}</div>
            </div>
        </div>
    );
};
