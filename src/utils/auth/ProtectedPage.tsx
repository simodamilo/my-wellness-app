import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedPage = () => {
    const { user } = useAuth();
    console.log("user at ProtectedPage: ", user);

    if (!user) {
        return <Navigate to="/my-wellness-app/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedPage;
