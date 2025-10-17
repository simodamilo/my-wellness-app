import { useEffect } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import { NotificationProvider } from "./components/notificationProvider/NotificationProvider";
import { Navbar } from "./components/navigationBar/NavBar";
import { useAuth } from "./utils/auth/AuthProvider";

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
    }, []);

    return (
        <NotificationProvider>
            <div className="w-screen h-dvh flex flex-col">
                {user && <Navbar />}
                <Outlet />
            </div>
        </NotificationProvider>
    );
}

export default App;
