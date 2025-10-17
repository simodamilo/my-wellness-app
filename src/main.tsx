import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import store, { useAppDispatch } from "./store/store.config.ts";
import AuthProvider, { useAuth } from "./utils/auth/AuthProvider.tsx";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { router } from "./utils/routing/router.tsx";

const MIN_SPLASH_TIME = 1000;

// eslint-disable-next-line react-refresh/only-export-components
const RootWithSplash = () => {
    const dispatch = useAppDispatch();
    const { user } = useAuth();

    const [showSplash, setShowSplash] = useState(true);
    const splashStartTime = useRef(Date.now());

    // Optional: load data if you want, otherwise ignore
    useEffect(() => {
        if (user) {
            // Example: fetch user-related data
            // dispatch(currentActions.fetchCurrentWorkout());
        }
    }, [user, dispatch]);

    // Always hide splash after MIN_SPLASH_TIME
    useEffect(() => {
        const elapsed = Date.now() - splashStartTime.current;
        const remaining = MIN_SPLASH_TIME - elapsed;

        const timer = setTimeout(() => setShowSplash(false), remaining > 0 ? remaining : 0);
        return () => clearTimeout(timer);
    }, []);

    if (showSplash) return <div className="splash-screen">Loading...</div>;

    return <RouterProvider router={router} />;
};

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <AuthProvider>
            <RootWithSplash />
        </AuthProvider>
    </Provider>
);
