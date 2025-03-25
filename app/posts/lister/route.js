import prisma from "../../prisma";

export async function GET() {
    try {
        const posts = await prisma.post.findMany({ include: { author: true } });
        return Response.json(posts, { status: 200 });
    } catch (error) {
        return Response.json({ error: "Erreur lors de la récupération des posts" }, { status: 500 });
    }
}