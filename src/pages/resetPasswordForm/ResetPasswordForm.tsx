import { useState } from "react";
import { useAuth } from "../../utils/auth/AuthProvider";

export const ResetPasswordForm = () => {
    const { updatePassword } = useAuth();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Le password non coincidono");
            return;
        }

        setLoading(true);
        const { error } = await updatePassword(password);
        if (error) setError(error.message);
        else setSuccess(true);

        setLoading(false);
    };

    return (
        <div className="h-dvh flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Imposta nuova password</h2>

                {success ? (
                    <p className="text-green-600 text-center">
                        Password aggiornata con successo! Ora puoi{" "}
                        <a href="/login" className="text-indigo-600 hover:underline">
                            accedere
                        </a>
                        .
                    </p>
                ) : (
                    <form onSubmit={handleReset} className="space-y-4">
                        <input type="password" placeholder="Nuova password" className="w-full border p-2 rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <input
                            type="password"
                            placeholder="Conferma password"
                            className="w-full border p-2 rounded-lg"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg">
                            {loading ? "Aggiornamento..." : "Aggiorna password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
