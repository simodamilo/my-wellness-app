import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../../App";
import { Login } from "../../pages/login/Login";
import ProtectedPage from "../auth/ProtectedPage";
import { Homepage } from "../../pages/homepage/Homepage";
import { Insights } from "../../pages/insights/Insights";
import { Settings } from "../../pages/settings/Settings";

export const router = createBrowserRouter([
    {
        path: "/wellness",
        element: <App />,
        errorElement: <div>Error loading page</div>,
        children: [
            { index: true, element: <Navigate to="/wellness/login" replace /> },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "homepage",
                element: <ProtectedPage />,
                children: [{ index: true, element: <Homepage /> }],
            },
            {
                path: "insights",
                element: <ProtectedPage />,
                children: [{ index: true, element: <Insights /> }],
            },
            {
                path: "settings",
                element: <ProtectedPage />,
                children: [{ index: true, element: <Settings /> }],
            },
        ],
    },
]);
