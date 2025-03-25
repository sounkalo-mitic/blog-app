import prisma from "../../prisma";
import jwt from "jsonwebtoken";

export async function GET(req) {
    try {
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ error: "Token manquant ou invalide" }), { status: 401 });
        }

        const token = authHeader.split(" ")[1];

        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        if (!decoded || !decoded.userId) {
            return new Response(JSON.stringify({ error: "Token invalide" }), { status: 401 });
        }

        // Récupérer l'utilisateur en base
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, name: true, email: true, role: true}
        });

        if (!user) {
            return new Response(JSON.stringify({ error: "Utilisateur non trouvé" }), { status: 404 });
        }

        return new Response(JSON.stringify(user), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        return new Response(JSON.stringify({ error: "Erreur serveur", details: error.message }), { status: 500 });
    }
}
