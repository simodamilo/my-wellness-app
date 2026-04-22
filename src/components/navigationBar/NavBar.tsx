import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../utils/routing/routes";
import { useTranslation } from "react-i18next";
import { IoSettingsOutline, IoStatsChart, IoBookOutline } from "react-icons/io5";
import type { IconType } from "react-icons";
import { motion } from "framer-motion";

interface NavItem {
    route: string;
    labelKey: string;
    Icon: IconType;
}

const items: NavItem[] = [
    { route: routes.homepage, labelKey: "COMMON.NAV.JOURNAL", Icon: IoBookOutline },
    { route: routes.insights, labelKey: "COMMON.NAV.INSIGHTS", Icon: IoStatsChart },
    { route: routes.settings, labelKey: "COMMON.NAV.SETTINGS", Icon: IoSettingsOutline },
];

export const Navbar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const activeIndex = items.findIndex((i) => i.route === location.pathname);
    if (activeIndex === -1) return null;

    const itemWidthPct = 100 / items.length;

    return (
        <div className="fixed bottom-3 left-0 right-0 z-50">
            <div className="max-w-[1280px] mx-auto px-4">
                <div className="relative flex items-stretch p-1 rounded-full bg-white/90 backdrop-blur-md shadow-lg">
                    <motion.div
                        className="absolute top-1 bottom-1 bg-[#c2185b] rounded-full"
                        initial={false}
                        animate={{ left: `calc(${activeIndex * itemWidthPct}% + 4px)` }}
                        style={{ width: `calc(${itemWidthPct}% - 8px)` }}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                    {items.map(({ route, labelKey, Icon }, index) => {
                        const isActive = index === activeIndex;
                        return (
                            <button
                                key={route}
                                onClick={() => navigate(route)}
                                className="relative z-10 flex items-center justify-center gap-2 py-2 flex-1"
                            >
                                <Icon
                                    size={20}
                                    className={`transition-colors ${isActive ? "text-white" : "text-gray-600"}`}
                                />
                                {isActive && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        transition={{ duration: 0.2, delay: 0.1 }}
                                        className="text-xs font-semibold tracking-wide uppercase text-white whitespace-nowrap overflow-hidden"
                                    >
                                        {t(labelKey)}
                                    </motion.span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
