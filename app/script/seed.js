const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
const prisma = require("../prisma");

const seedUsers = async () => {
    try {
        console.log("🔄 Début du seed des utilisateurs...");

        const users = [];

        for (let i = 0; i < 10; i++) {
            const hashedPassword = await bcrypt.hash("password123", 10);

            users.push({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: hashedPassword,
                role: faker.helpers.arrayElement(["USER", "ADMIN"]),
            });
        }

        // Insérer les utilisateurs dans la base
        await prisma.user.createMany({ data: users });

        console.log("✅ 10 utilisateurs ajoutés avec succès !");
    } catch (error) {
        console.error("❌ Erreur lors du seed :", error);
    } finally {
        await prisma.$disconnect();
    }
};

const seedPosts = async () => {
    try {
        console.log("🔄 Début du seed des posts...");

        // Récupérer les utilisateurs existants pour assigner des posts
        const users = await prisma.user.findMany({ select: { id: true } });

        if (users.length === 0) {
            console.error("❌ Aucun utilisateur trouvé. Exécute d'abord `seedUsers.js`.");
            return;
        }

        const posts = [];

        for (let i = 0; i < 20; i++) {
            posts.push({
                title: faker.lorem.sentence(),
                content: faker.lorem.paragraphs(2),
                thumbnail: faker.image.url(), // URL d'image aléatoire
                authorId: faker.helpers.arrayElement(users).id, // Associer à un utilisateur existant
            });
        }

        // Insérer les posts dans la base
        await prisma.post.createMany({ data: posts });

        console.log("✅ 20 posts ajoutés avec succès !");
    } catch (error) {
        console.error("❌ Erreur lors du seed :", error);
    } finally {
        await prisma.$disconnect();
    }
};

const runSeed = async () => {
    try {
        await seedUsers();
        await seedPosts();
    } catch (error) {
        console.error("❌ Erreur lors du seed :", error);
    } finally {
        await prisma.$disconnect();
    }
};

runSeed();