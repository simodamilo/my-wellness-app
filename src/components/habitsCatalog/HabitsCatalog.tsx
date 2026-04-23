import { useEffect, useState } from "react";
import { useAppDispatch, type RootState } from "../../store";
import { habitsActions } from "../../store/habits/habits.action";
import { Input, Popover, Spin } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import type { Habit } from "../../store/habits/types";
import { useTranslation } from "react-i18next";
import { habitsSelectors } from "../../store/habits/habits.selector";
import { IoPencil, IoTrashOutline, IoCheckmark, IoClose, IoAdd } from "react-icons/io5";

const DEFAULT_EMOJI = "⭐";

const HABIT_EMOJIS = [
    "⭐", "🏋️", "🏃", "🚶", "🧘", "🤸", "🚴", "🏊",
    "📖", "✍️", "📝", "🎨", "🎵", "🎸", "📚", "🧠",
    "🥗", "🍎", "🥦", "🥛", "💧", "☕", "🍵", "🥤",
    "😴", "🌙", "☀️", "🌱", "🌸", "🌿", "💆", "🛁",
    "💊", "💖", "🧡", "💛", "💚", "💙", "💜", "✨",
    "🔥", "⚡", "🎯", "🏆", "✅", "📅", "⏰", "🎉",
];

const EmojiTriggerButton = ({
    emoji,
    open,
    setOpen,
    onPick,
    size = "md",
}: {
    emoji: string;
    open: boolean;
    setOpen: (v: boolean) => void;
    onPick: (emoji: string) => void;
    size?: "sm" | "md";
}) => (
    <Popover
        trigger="click"
        open={open}
        onOpenChange={setOpen}
        content={
            <div className="grid grid-cols-8 gap-1 w-[260px] max-h-[220px] overflow-y-auto p-1">
                {HABIT_EMOJIS.map((e) => {
                    const isSelected = e === emoji;
                    return (
                        <button
                            key={e}
                            onClick={() => {
                                onPick(e);
                                setOpen(false);
                            }}
                            className={`flex items-center justify-center w-8 h-8 rounded-lg text-lg transition-colors ${
                                isSelected ? "bg-[#c2185b]/15 ring-1 ring-[#c2185b]" : "hover:bg-gray-100"
                            }`}
                        >
                            {e}
                        </button>
                    );
                })}
            </div>
        }
    >
        <button
            className={`flex items-center justify-center rounded-full bg-white/70 hover:bg-white transition-colors shrink-0 leading-none ${
                size === "sm" ? "w-8 h-8 text-lg" : "w-10 h-10 text-xl"
            }`}
        >
            <span className="leading-none -translate-y-[1px]">{emoji}</span>
        </button>
    </Popover>
);

const HabitRow = ({ habit }: { habit: Habit }) => {
    const dispatch = useAppDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [draftName, setDraftName] = useState(habit.name);
    const [draftEmoji, setDraftEmoji] = useState(habit.emoji);
    const [pickerOpen, setPickerOpen] = useState(false);

    const startEdit = () => {
        setDraftName(habit.name);
        setDraftEmoji(habit.emoji);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setPickerOpen(false);
    };

    const saveEdit = () => {
        const trimmed = draftName.trim();
        if (trimmed === "") return;
        if (trimmed === habit.name && draftEmoji === habit.emoji) {
            setIsEditing(false);
            return;
        }
        dispatch(habitsActions.updateHabit({ id: habit.id, name: trimmed, emoji: draftEmoji }));
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <EmojiTriggerButton
                    size="sm"
                    emoji={draftEmoji}
                    open={pickerOpen}
                    setOpen={setPickerOpen}
                    onPick={setDraftEmoji}
                />
                <Input
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    onPressEnter={saveEdit}
                    autoFocus
                />
                <button
                    onClick={saveEdit}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-[#c2185b] text-white"
                >
                    <IoCheckmark size={16} />
                </button>
                <button
                    onClick={cancelEdit}
                    className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-black/5"
                >
                    <IoClose size={16} />
                </button>
            </div>
        );
    }

    return (
        <div className="group flex justify-between items-center rounded-xl hover:bg-white/60 transition-colors">
            <div className="flex items-center gap-3">
                <span className="text-xl">{habit.emoji}</span>
                <p className="font-medium text-sm text-gray-800">{habit.name}</p>
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={startEdit}
                    className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:text-[#c2185b] hover:bg-white transition-colors"
                    aria-label="Edit"
                >
                    <IoPencil size={14} />
                </button>
                <button
                    onClick={() => dispatch(habitsActions.deleteHabit(habit.id))}
                    className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:text-red-500 hover:bg-white transition-colors"
                    aria-label="Remove"
                >
                    <IoTrashOutline size={14} />
                </button>
            </div>
        </div>
    );
};

export const HabitsCatalog = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [newHabit, setNewHabit] = useState<string>("");
    const [newEmoji, setNewEmoji] = useState<string>(DEFAULT_EMOJI);
    const [pickerOpen, setPickerOpen] = useState<boolean>(false);

    const habits = useSelector((state: RootState) => habitsSelectors.getHabits(state));
    const isLoading = useSelector((state: RootState) => habitsSelectors.isLoading(state));

    useEffect(() => {
        dispatch(habitsActions.getHabits());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onAddHabit = () => {
        if (newHabit.trim() === "") return;
        dispatch(
            habitsActions.addHabit({
                id: uuidv4(),
                name: newHabit.trim(),
                emoji: newEmoji,
            })
        );
        setNewHabit("");
        setNewEmoji(DEFAULT_EMOJI);
    };

    if (isLoading && habits.length === 0) {
        return (
            <div className="flex items-center justify-around py-4">
                <Spin />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {habits.length > 0 && (
                <div className="flex flex-col">
                    {habits.map((habit: Habit) => (
                        <HabitRow key={habit.id} habit={habit} />
                    ))}
                </div>
            )}
            <div className="flex gap-2 items-center">
                <EmojiTriggerButton
                    size="sm"
                    emoji={newEmoji}
                    open={pickerOpen}
                    setOpen={setPickerOpen}
                    onPick={setNewEmoji}
                />
                <Input
                    placeholder={t("SETTINGS.HABITS_CATALOG.PLACEHOLDER")}
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    onPressEnter={onAddHabit}
                />
                <button
                    onClick={onAddHabit}
                    className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-[#c2185b] text-white hover:bg-[#a31650] transition-colors"
                    aria-label="Add"
                >
                    <IoAdd size={18} />
                </button>
            </div>
        </div>
    );
};
