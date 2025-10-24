import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/auth/AuthProvider";
import { routes } from "../../utils/routing/routes";

export const Signup = () => {
    const navigate = useNavigate();
    const { user, signUp } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user) navigate(routes.homepage);
    }, [user, navigate]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await signUp(email, password);
        if (error) setError(error.message);
        else setSuccess(true);

        setLoading(false);
    };

    return (
        <div className="h-dvh flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Registrati</h2>

                {success ? (
                    <p className="text-green-600 text-center">Registrazione completata! Controlla la tua email per confermare l’account.</p>
                ) : (
                    <form onSubmit={handleSignup} className="space-y-4">
                        <input type="email" placeholder="Email" className="w-full border p-2 rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input type="password" placeholder="Password" className="w-full border p-2 rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg">
                            {loading ? "Creazione account..." : "Registrati"}
                        </button>
                    </form>
                )}

                <div className="mt-4 text-center text-sm">
                    <p>
                        Hai già un account?{" "}
                        <span className="text-indigo-600 hover:underline cursor-pointer" onClick={() => navigate(routes.login)}>
                            Accedi
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};
