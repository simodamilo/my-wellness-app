import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/auth/AuthProvider";
import { routes } from "../../utils/routing/routes";

export const Login = () => {
    const navigate = useNavigate();
    const { user, signInWithEmail } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) navigate("/my-wellness-app/homepage");
    }, [user, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await signInWithEmail(email, password);
        if (error) setError(error.message);

        setLoading(false);
    };

    return (
        <div className="h-dvh flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Accedi</h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" placeholder="Email" className="w-full border p-2 rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" className="w-full border p-2 rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg">
                        {loading ? "Accesso in corso..." : "Accedi"}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm">
                    <p>
                        Non hai un account?{" "}
                        <span className="text-indigo-600 hover:underline cursor-pointer" onClick={() => navigate(routes.signup)}>
                            Registrati
                        </span>
                    </p>
                    <p className="mt-1">
                        <span className="text-indigo-600 hover:underline cursor-pointer" onClick={() => navigate(routes.forgotPassword)}>
                            Hai dimenticato la password?
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};
