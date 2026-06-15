const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const existing = await prisma.status.findFirst({ where: { context: 'ACCEPTED' } });
  if (!existing) {
    await prisma.status.create({
      data: {
        context: 'ACCEPTED'
      }
    });
    console.log('ACCEPTED status added');
  } else {
    console.log('ACCEPTED status already exists');
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
