const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'manager@garage37.com' } });
  if (!user) { console.log('User not found'); return; }
  const business = await prisma.business.findFirst({ where: { managerId: user.id } });
  if (!business) { console.log('Business not found'); return; }
  
  const count = await prisma.businessDocument.deleteMany({
    where: { businessId: business.id }
  });
  console.log('Deleted ' + count.count + ' documents.');
}
main().catch(console.error).finally(() => prisma.$disconnect());
