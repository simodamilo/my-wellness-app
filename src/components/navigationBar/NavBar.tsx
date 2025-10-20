import { Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../utils/routing/routes";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { IoSettingsOutline } from "react-icons/io5";

export const Navbar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === routes.insights || location.pathname === routes.settings) {
        return (
            <div className="fixed h-[48px] w-full flex justify-start items-center pl-3">
                <ArrowLeftOutlined size={24} style={{ color: "#c2185b" }} onClick={() => navigate(routes.homepage)} />
            </div>
        );
    }
    if (location.pathname === routes.homepage) {
        return (
            <div className="fixed h-[48px] w-full flex justify-between items-center pr-3 pl-4">
                <IoSettingsOutline size={24} onClick={() => navigate(routes.settings)} />
                <Button style={{ color: "#c2185b", fontWeight: "bold", fontSize: "16px" }} type="link" size="small" onClick={() => navigate(routes.insights)}>
                    {t("COMMON.INSIGHTS_BUTTON")}
                </Button>
            </div>
        );
    }
};
