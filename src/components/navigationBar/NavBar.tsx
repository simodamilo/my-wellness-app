import { Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../utils/routing/routes";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export const Navbar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === routes.insights) {
        return (
            <div className="fixed h-[48px] w-full flex justify-start items-center pl-3">
                <ArrowLeftOutlined style={{ color: "#c2185b" }} onClick={() => navigate(routes.homepage)} />
            </div>
        );
    }
    if (location.pathname === routes.homepage) {
        return (
            <div className="fixed h-[48px] w-full flex justify-end items-center pr-3">
                <Button style={{ color: "#c2185b", fontWeight: "bold" }} type="link" size="small" onClick={() => navigate(routes.insights)}>
                    {t("COMMON.INSIGHTS_BUTTON")}
                </Button>
            </div>
        );
    }
};
