import prisma from "../../../prisma";
import { requireAuth } from "../../../middleware";

// Handler pour la méthode PUT
export async function PUT(req) {
    const url = req.nextUrl.pathname;  // récupère l'URL complète
    const id = url.split('/').pop();   // extrait l'ID de l'URL

    console.log('id:', id);
    try {
        // Vérification de l'authentification
        const user = await requireAuth(req);
        if (user.error) {
            return Response.json(user, { status: user.status });
        }

        // Récupère les données de la requête
        const { title, content, thumbnail } = await req.json();

        // Vérifie si le post existe (en utilisant un UUID comme identifiant)
        const post = await prisma.post.findUnique({ where: { id } }); // L'id est déjà sous forme de chaîne
        if (!post) {
            return Response.json({ error: "Post non trouvé" }, { status: 404 });
        }

        // Si l'utilisateur est un administrateur, il peut modifier n'importe quel post
        if (user.role === "ADMIN") {
            const updatedPost = await prisma.post.update({
                where: { id },
                data: { title, content, thumbnail },
            });
            return Response.json({ message: "Post mis à jour", updatedPost }, { status: 200 });
        }

        // Si l'utilisateur est un utilisateur standard (USER), il ne peut modifier que ses propres posts
        if (post.authorId !== user.id) {
            return Response.json({ error: "Accès interdit" }, { status: 403 });
        }

        // Mise à jour du post par l'utilisateur
        const updatedPost = await prisma.post.update({
            where: { id },
            data: { title, content, thumbnail },
        });

        return Response.json({ message: "Post mis à jour", updatedPost }, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du post:', error);  // Log de l'erreur
        return Response.json({ error: "Erreur lors de la mise à jour du post", details: error.message }, { status: 500 });
    }
}



// Handler pour la méthode DELETE
export async function DELETE(req) {
    const url = req.nextUrl.pathname;  // récupère l'URL complète
    const id = url.split('/').pop();   // extrait l'ID de l'URL

    try {
        // Vérification de l'authentification
        const user = await requireAuth(req);
        if (user.error) {
            return Response.json(user, { status: user.status });
        }

        // Vérifie si le post existe
        const post = await prisma.post.findUnique({ where: { id } }); // Utilisation de l'ID sous forme de chaîne
        if (!post) {
            return Response.json({ error: "Post non trouvé" }, { status: 404 });
        }

        // Si l'utilisateur est un administrateur, il peut supprimer n'importe quel post
        if (user.role === "ADMIN") {
            await prisma.post.delete({ where: { id } });
            return Response.json({ message: "Post supprimé" }, { status: 200 });
        }

        // Si l'utilisateur est un utilisateur standard (USER), il ne peut supprimer que ses propres posts
        if (post.authorId !== user.id) {
            return Response.json({ error: "Accès interdit" }, { status: 403 });
        }

        // Suppression du post par l'utilisateur
        await prisma.post.delete({ where: { id } });

        return Response.json({ message: "Post supprimé" }, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la suppression du post:", error);  // Log de l'erreur pour le débogage
        return Response.json({ error: "Erreur lors de la suppression du post", details: error.message }, { status: 500 });
    }
}

