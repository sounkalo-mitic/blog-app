import prisma from "./prisma";
import jwt from "jsonwebtoken";

// Middleware de vérification du rôle
export async function requireAuth(req) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            // Retourner un objet d'erreur au lieu de Response directement
            return { error: "Accès refusé, token requis", status: 401 };
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            return { error: "Utilisateur non trouvé", status: 403 }; // Même logique ici, renvoyer un objet d'erreur
        }

        return user; // Retourne l'utilisateur authentifié
    } catch (error) {
        return { error: "Token invalide ou expiré", status: 403 }; // Et ici aussi
    }
}


// Vérifie si l'utilisateur est ADMIN
export async function requireAdmin(req) {
    const user = await requireAuth(req); // Vérifie l'authentification de l'utilisateur
    if (!user || user.role !== "ADMIN") {
        return Response.json({ error: "Accès interdit" }, { status: 403 });
    }
    return user; // Retourne l'utilisateur ADMIN
}
