
const { PrismaClient } = require('@prisma/client');

// One shared Prisma client for this application process.
const prisma = new PrismaClient();

module.exports = prisma;
