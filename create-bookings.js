const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function main() {
  console.log('Fetching users...');
  const providerUser = await prisma.user.findUnique({ where: { email: 'manager@garage37.com' } });
  const clientUser = await prisma.user.findUnique({ where: { email: 'mohamedwafdy2004@gmail.com' } });

  if (!providerUser || !clientUser) {
    console.error('Provider or Client user not found!');
    return;
  }

  const business = await prisma.business.findFirst({ where: { managerId: providerUser.id } });
  if (!business) {
    console.error('Business not found for provider!');
    return;
  }

  const client = await prisma.client.findUnique({ where: { userId: clientUser.id } });
  if (!client) {
    console.error('Client profile not found!');
    return;
  }

  let vehicle = await prisma.clientVehicle.findFirst({ where: { clientId: client.id } });
  if (!vehicle) {
    console.log('Vehicle not found, creating one...');
    vehicle = await prisma.clientVehicle.create({
      data: {
        id: crypto.randomUUID(),
        clientId: client.id,
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        licensePlate: 'ABC-123',
        color: 'White'
      }
    });
  }

  const businessServices = await prisma.businessService.findMany({
    where: { businessId: business.id },
    take: 2
  });

  if (businessServices.length === 0) {
    console.error('No business services found for provider!');
    return;
  }

  const confirmedStatus = await prisma.status.findFirst({ where: { context: 'CONFIRMED' } });
  const paidStatus = await prisma.status.findFirst({ where: { context: 'PAID' } });
  const paymentMethod = await prisma.paymentMethod.findFirst();

  if (!confirmedStatus || !paidStatus || !paymentMethod) {
    console.error('Required statuses or payment methods missing!');
    return;
  }

  console.log('Creating 5 paid bookings...');
  
  for (let i = 0; i < 5; i++) {
    const subTotal = 150.00;
    const commission = 15.00;
    const totalPrice = 150.00;
    
    const bookingId = crypto.randomUUID();

    const booking = await prisma.booking.create({
      data: {
        id: bookingId,
        businessId: business.id,
        vehicleId: vehicle.id,
        scheduledAt: new Date(new Date().getTime() + (i + 1) * 24 * 60 * 60 * 1000), // Next days
        expectedDeliveryAt: new Date(new Date().getTime() + (i + 1) * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // + 4 hours
        subTotal,
        discount: 0,
        commission,
        totalPrice,
        statusHistory: {
          create: [
            { id: crypto.randomUUID(), statusId: confirmedStatus.id }
          ]
        },
        items: {
          create: businessServices.map(bs => ({
            id: crypto.randomUUID(),
            businessServiceId: bs.id,
            price: bs.price
          }))
        },
        payment: {
          create: {
            id: crypto.randomUUID(),
            amount: totalPrice,
            currency: 'USD',
            paymentMethod: { connect: { id: paymentMethod.id } },
            status: { connect: { id: paidStatus.id } },
            provider: 'STRIPE',
            providerRef: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            paidAt: new Date()
          }
        }
      }
    });
    console.log(`Created booking ${booking.id}`);
  }

  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
