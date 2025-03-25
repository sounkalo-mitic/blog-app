"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Utilisateur non authentifié");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/posts/ajouter",
        { title, content, thumbnail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        router.push("/"); // Rediriger vers la liste des posts
      }
    } catch (err) {
      setError("Erreur lors de la création du post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Créer un Post</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contenu</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Image (URL)</label>
          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Création en cours..." : "Créer"}
        </button>
      </form>
    </div>
  );
}
