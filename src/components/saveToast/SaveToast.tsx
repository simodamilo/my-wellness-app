import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoCheckmarkCircle } from "react-icons/io5";

type Listener = () => void;
const listeners = new Set<Listener>();

export const showSaveToast = () => {
    listeners.forEach((l) => l());
};

export const SaveToast = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | null = null;
        const onTrigger = () => {
            setVisible(true);
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => setVisible(false), 1500);
        };
        listeners.add(onTrigger);
        return () => {
            listeners.delete(onTrigger);
            if (timer) clearTimeout(timer);
        };
    }, []);

    return (
        <div className="fixed top-4 left-0 right-0 z-[60] pointer-events-none flex justify-center">
            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-[#c2185b]/15"
                    >
                        <IoCheckmarkCircle size={16} className="text-[#c2185b]" />
                        <span className="text-xs font-semibold text-[#c2185b]">Saved</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
