import { Button } from "antd";

export const Navbar = () => {
    return (
        <div className="fixed top-0 left-0 h-[48px] w-full bg-[var(--primary-color)] flex justify-end items-center px-4">
            <Button variant="outlined" size="small">
                Insights
            </Button>
        </div>
    );
};
