import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../../App";
import { Login } from "../../pages/login/Login";
import ProtectedPage from "../auth/ProtectedPage";
import { Homepage } from "../../pages/homepage/Homepage";
import { Insights } from "../../pages/insights/Insights";
import { Settings } from "../../pages/settings/Settings";
import { Signup } from "../../pages/signup/Signup";
import { ForgotPassword } from "../../pages/forgotPassword/ForgotPassword";
import { ResetPasswordForm } from "../../pages/resetPasswordForm/ResetPasswordForm";

export const router = createBrowserRouter([
    {
        path: "/my-wellness-app",
        element: <App />,
        errorElement: <div>Error loading page</div>,
        children: [
            { index: true, element: <Navigate to="/my-wellness-app/login" replace /> },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "signup",
                element: <Signup />,
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />,
            },
            {
                path: "reset-password",
                element: <ResetPasswordForm />,
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
