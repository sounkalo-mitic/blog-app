"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function EditPost() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  const [post, setPost] = useState({ title: "", content: "", thumbnail: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Utilisateur non authentifié");
          setLoading(false);
          return;
        }

        // Charger le post existant
        const response = await axios.get(`http://localhost:3000/posts/getPost/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPost(response.data);
      } catch (err) {
        setError("Erreur lors du chargement du post.");
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchPost();
  }, [postId]);

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3000/posts/modification/${postId}`,
        { title: post.title, content: post.content, thumbnail: post.thumbnail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Post mis à jour avec succès !");
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      setError("Erreur lors de la mise à jour du post.");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Modifier le Post</h2>

      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Titre</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Contenu</label>
          <textarea
            name="content"
            value={post.content}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Image (URL)</label>
          <input
            type="text"
            name="thumbnail"
            value={post.thumbnail}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Modifier
        </button>
      </form>
    </div>
  );
}
