'use client';
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const RegisterForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER'); // Par défaut, le rôle est USER
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/auth/signup', { name, email, password, role });
            setSuccessMessage(response.data.message);
            setError('');
        } catch (error) {
            setError(error.response?.data?.error || "Erreur lors de l'inscription");
            setSuccessMessage('');
        }
    };


    return (
        <div className="max-w-md mx-auto p-8 border rounded-lg shadow-lg bg-white mt-5">
            <h2 className="text-2xl font-semibold text-center mb-6">Inscription</h2>

            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            {successMessage && <div className="text-green-500 text-center mb-4">{successMessage}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rôle</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="USER">Utilisateur</option>
                        <option value="ADMIN">Administrateur</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
                >
                    S'inscrire
                </button>
            </form>
            {/* redirection sur la page de connexion */}
            <p className="text-center mt-4">Vous avez déjà un compte ? <Link href="/pages/connexion" className="text-blue-500 cursor-pointer">Connectez-vous</Link></p>
        </div>
    );
};

export default RegisterForm;
