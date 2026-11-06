const prisma = require('../db/prisma');

async function findAll() {
  return prisma.post.findMany({
    orderBy: { id: 'asc' },
  });
}

async function findById(id) {
  return prisma.post.findUnique({
    where: { id: Number(id) },
  });
}

async function create(fields) {
  try {
    return await prisma.post.create({
      data: {
        title: fields.title,
        body: fields.body || '',
        authorId: fields.authorId,
      },
    });
  } catch (error) {
    if (error.code === 'P2003') {
      const safeError = new Error('Related user does not exist');
      safeError.statusCode = 400;
      throw safeError;
    }

    if (error.code === 'P2002') {
      const safeError = new Error('A record with these details already exists');
      safeError.statusCode = 409;
      throw safeError;
    }

    throw error;
  }
}

async function update(id, patch) {
  const existing = await findById(id);
  if (!existing) return null;

  return prisma.post.update({
    where: { id: Number(id) },
    data: {
      ...(patch.title !== undefined && { title: patch.title }),
      ...(patch.body !== undefined && { body: patch.body }),
    },
  });
}

async function remove(id) {
  const existing = await findById(id);
  if (!existing) return false;

  await prisma.post.delete({
    where: { id: Number(id) },
  });

  return true;
}

module.exports = { findAll, findById, create, update, remove };