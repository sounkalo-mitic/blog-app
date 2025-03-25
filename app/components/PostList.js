"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  //useEffect pour recuperer l'utilisateur connecter 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Utilisateur non authentifié");
          setLoading(false);
          return;
        }
        const userResponse = await axios.get("http://localhost:3000/auth/getUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userResponse.data.error) {
          setError(userResponse.data.error);
          setLoading(false);
          router.push("/pages/connexion");
          return;
        }
        setUser(userResponse.data);
      } catch (err) {
        console.log('err', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les posts
        const postsResponse = await axios.get("http://localhost:3000/posts/lister");
        setPosts(postsResponse.data);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //methode pour supprimer un post
  const deletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/posts/modification/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Recharger la liste des posts
      const postsResponse = await axios.get("http://localhost:3000/posts/lister");
      setPosts(postsResponse.data);
    } catch (err) {
      setError("Erreur lors de la suppression du post.");
    }
  }

  if (loading) return <p className="text-center text-gray-500">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      {
        posts.length == 0 ? (
          <p className="text-center text-gray-500">Aucun post trouvé.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-4">
                {post.thumbnail && (
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-40 object-cover rounded-md"
                  />
                )}
                <h2 className="text-xl font-semibold mt-2">{post.title}</h2>
                <p className="text-gray-600 text-sm">{post.content.substring(0, 100)}...</p>
                <p className="text-gray-400 text-xs mt-2">Par {post.author.name}</p>

                {/* Afficher les boutons Modifier/Supprimer si l'utilisateur est l'auteur ou ADMIN */}
                {user && (user.id === post.authorId || user.role === "ADMIN") && (
                  <div className="flex gap-2 mt-4">
                    <button className="px-3 py-1 text-white bg-blue-500 rounded" onClick={() => router.push(`/pages/editPost?id=${post.id}`)}>Modifier</button>
                    <button className="px-3 py-1 text-white bg-red-500 rounded" onClick={() => deletePost(post.id)}>Supprimer</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
