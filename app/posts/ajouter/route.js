import prisma from "../../prisma";
import { requireAuth } from "../../middleware"; 

export async function POST(req) {
    const authResult = await requireAuth(req); 

    // Vérification si requireAuth renvoie une erreur 
    if (authResult.error) {
        return new Response(JSON.stringify({ error: authResult.error }), { status: authResult.status });
    }

    
    const user = authResult; 

    try {
        const body = await req.json();
        const { title, content, thumbnail } = body;

        // Création du post dans la base de données
        const post = await prisma.post.create({
            data: { title, content, thumbnail, authorId: user.id }, // Utiliser l'ID de l'utilisateur authentifié
        });
        return new Response(JSON.stringify({ message: "Post créé", post }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Erreur lors de la création du post" }), { status: 500 });
    }
}
