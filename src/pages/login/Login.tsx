import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../store/supabaseClient";
import { useAuth } from "../../utils/auth/AuthProvider";

export const Login = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate("/wellness/homepage");
        }
    }, [user, navigate]);

    return (
        <div className="p-4 h-dvh">
            <div className="container mx-auto max-w-md">
                <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} view="sign_in" onlyThirdPartyProviders={false} />
            </div>
        </div>
    );
};
