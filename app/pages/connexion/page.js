'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:3000/auth/login", { email, password });
            console.log("Réponse de l'API:", response.data);

            if (response.data && response.data.token) {
                localStorage.setItem("token", response.data.token);
                router.push("/");
            } else {
                setError("Réponse invalide du serveur.");
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            console.error("Erreur Axios:", err.response?.data || err);
            setError(err.response?.data?.error || "Une erreur est survenue, veuillez réessayer.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4">Se connecter</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300"
                        disabled={loading}
                    >
                        {loading ? "Chargement..." : "Se connecter"}
                    </button>
                </form>
                <p className="text-center mt-4">
                    Vous n'avez pas de compte ? <Link href="/pages/inscription" className="text-blue-700">Inscrivez-vous</Link>
                </p>
            </div>
        </div>
    );
}
