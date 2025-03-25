import prisma from "../../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password } = body;

        console.log('Données reçues:', { email, password });

        // Vérifier si l'utilisateur existe
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return new Response(JSON.stringify({ error: "Utilisateur non trouvé" }), { status: 404 });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new Response(JSON.stringify({ error: "Mot de passe incorrect" }), { status: 401 });
        }

        // Générer le token JWT
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );

        console.log('Token généré:', token);

        return new Response(JSON.stringify({ message: "Connexion réussie", token, user }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return new Response(JSON.stringify({ error: "Erreur lors de la connexion", details: error.message }), { status: 500 });
    }
}
