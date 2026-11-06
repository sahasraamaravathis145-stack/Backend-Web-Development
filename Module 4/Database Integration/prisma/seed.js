const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Demo User',
    },
  });

  await prisma.post.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: 'First post',
      body: 'The contract survives storage changes.',
      authorId: 1,
    },
  });

  await prisma.post.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      title: 'Second post',
      body: 'Migrations record database design.',
      authorId: 1,
    },
  });

    // Synchronize auto-increment sequences after inserting explicit IDs.
  await prisma.$queryRaw`
    SELECT setval(
      pg_get_serial_sequence('"User"', 'id'),
      (SELECT COALESCE(MAX(id), 1) FROM "User")
    )
  `;

  await prisma.$queryRaw`
    SELECT setval(
      pg_get_serial_sequence('"Post"', 'id'),
      (SELECT COALESCE(MAX(id), 1) FROM "Post")
    )
  `;

  console.log('Database seeded successfully');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });