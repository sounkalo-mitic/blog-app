"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import PostsList from "./components/PostList";

export default function PostsPage() {
  const router = useRouter();

  const handleAddPost = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Vous devez être connecté pour ajouter un post.");
      router.push("/pages/connexion");
      return;
    }

    try {
      // Vérifier si l'utilisateur est authentifié via l'API getUser
      const response = await axios.get("http://localhost:3000/auth/getUser", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        router.push("/pages/createPost"); // Redirige vers la page d'ajout
      } else {
        throw new Error("Utilisateur non authentifié");
      }
    } catch (error) {
      alert("Votre session a expiré. Veuillez vous reconnecter.");
      router.push("/pages/connexion");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-between items-center bg-gray-100 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">📜 Liste des Posts</h1>
        <button
          onClick={handleAddPost}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
        >
          Ajouter un post
        </button>
      </div>
      <PostsList />
    </div>
  );
}
