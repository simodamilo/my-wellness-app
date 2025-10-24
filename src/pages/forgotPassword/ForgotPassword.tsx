import { useState } from "react";
import { useAuth } from "../../utils/auth/AuthProvider";
import { routes } from "../../utils/routing/routes";
import { useNavigate } from "react-router-dom";

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await resetPassword(email);
        if (error) setError(error.message);
        else setSuccess(true);

        setLoading(false);
    };

    return (
        <div className="h-dvh flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

                {success ? (
                    <p className="text-green-600 text-center">Controlla la tua email per reimpostare la password.</p>
                ) : (
                    <form onSubmit={handleReset} className="space-y-4">
                        <input type="email" placeholder="Email" className="w-full border p-2 rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg">
                            {loading ? "Invio email..." : "Invia email di reset"}
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
