import prisma from "../../prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        const body = await req.json(); // Lire le body de la requête
        const { name, email, password, role } = body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, role },
        });

        return Response.json({ message: "Utilisateur créé", user }, { status: 201 });
    } catch (error) {
        return Response.json({ error: "Erreur lors de l'inscription" }, { status: 500 });
    }
}
