import { Input } from "antd";
import { useTranslation } from "react-i18next";
import type { Input as InputType } from "../../store/inputs/types";
const { TextArea } = Input;

interface NotesProps {
    notes?: string;
    setNotes?: (updatedFields: Partial<InputType>) => void;
}

export const Notes = (props: NotesProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center gap-2">
            <h2 className="text-lg font-semibold mb-1 text-gray-700">{t("INPUTS.NOTES.TITLE")}</h2>
            <TextArea
                rows={4}
                value={props.notes}
                placeholder={t("INPUTS.NOTES.PLACEHOLDER")}
                onChange={(e) => props.setNotes?.({ notes: e.target.value as string })}
                autoSize={{ minRows: 3, maxRows: 5 }}
            />
        </div>
    );
};
