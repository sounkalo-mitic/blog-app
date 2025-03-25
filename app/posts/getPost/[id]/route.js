import prisma from "../../../prisma";

export async function GET(req) {
    try {
        const url = req.nextUrl.pathname;  // récupère l'URL complète
        const id = url.split('/').pop();   // extrait l'ID de l'URL

        // Vérifier si l'ID est valide
        if (!id) {
            return new Response(JSON.stringify({ error: "ID invalide" }), { status: 400 });
        }

        // Rechercher le post par ID
        const post = await prisma.post.findUnique({
            where: { id: id },
            include: { author: true }
        });

        if (!post) {
            return new Response(JSON.stringify({ error: "Post non trouvé" }), { status: 404 });
        }

        return new Response(JSON.stringify(post), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Erreur lors de la récupération du post", details: error.message }), { status: 500 });
    }
}
