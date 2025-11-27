import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { NotificationProvider } from "./components/notificationProvider/NotificationProvider";
import { Navbar } from "./components/navigationBar/NavBar";
import { useAuth } from "./utils/auth/AuthProvider";
import NotificationService from "./utils/NotificatioService";

function App() {
    const { user } = useAuth();

    useEffect(() => {
        const splash = document.getElementById("splash-screen");
        if (splash) {
            splash.style.opacity = "0";
            splash.style.transition = "opacity 0.5s ease-out";

            setTimeout(() => {
                splash.remove();
            }, 500);
        }

        NotificationService.init();

        if (user?.id) {
            NotificationService.setExternalUserId(user.id);
        }
    }, []);

    return (
        <NotificationProvider>
            <div className="h-screen max-w-[1280px] m-auto text-[var(--secondary-color)]">
                {user && <Navbar />}
                <Outlet />
            </div>
        </NotificationProvider>
    );
}

export default App;
