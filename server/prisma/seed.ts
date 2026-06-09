// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// =====================================================================
// Helper Functions
// =====================================================================

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

function futureDate(daysFromNow: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d;
}

function pastDate(daysAgo: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

// =====================================================================
// Main Seed
// =====================================================================

async function main() {
  console.log('🌱 Seeding Glow-Fix database...\n');

  // =====================================================================
  // 1. SETTINGS
  // =====================================================================
  console.log('📦 Creating settings...');

  await prisma.setting.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      businessFeePct: 10.0,
      maxCancelMinutes: 120,
    },
  });

  console.log('✅ Settings created');

  // =====================================================================
  // 2. STATUSES
  // =====================================================================
  console.log('\n📦 Creating statuses...');

  const statusDefs = [
    { name: 'PENDING_REVIEW', context: 'BUSINESS' },
    { name: 'APPROVED', context: 'BUSINESS' },
    { name: 'SUSPENDED', context: 'BUSINESS' },
    { name: 'REJECTED', context: 'BUSINESS' },
    { name: 'DOC_PENDING', context: 'DOCUMENT' },
    { name: 'DOC_ACCEPTED', context: 'DOCUMENT' },
    { name: 'DOC_REJECTED', context: 'DOCUMENT' },
    { name: 'PENDING', context: 'BOOKING' },
    { name: 'CONFIRMED', context: 'BOOKING' },
    { name: 'VEHICLE_RECEIVED', context: 'BOOKING' },
    { name: 'IN_PROGRESS', context: 'BOOKING' },
    { name: 'DIAGNOSIS_SENT', context: 'BOOKING' },
    { name: 'DIAGNOSIS_ACCEPTED', context: 'BOOKING' },
    { name: 'READY_FOR_PICKUP', context: 'BOOKING' },
    { name: 'COMPLETED', context: 'BOOKING' },
    { name: 'CANCELLED', context: 'BOOKING' },
    { name: 'PAYMENT_PENDING', context: 'PAYMENT' },
    { name: 'PAID', context: 'PAYMENT' },
    { name: 'REFUNDED', context: 'PAYMENT' },
    { name: 'FAILED', context: 'PAYMENT' },
    { name: 'PAYOUT_PENDING', context: 'PAYMENT' },
    { name: 'PAYOUT_PROCESSED', context: 'PAYMENT' },
    { name: 'OPEN', context: 'CONVERSATION' },
    { name: 'CLOSED', context: 'CONVERSATION' },
    { name: 'SENT', context: 'MESSAGE' },
    { name: 'DELIVERED', context: 'MESSAGE' },
    { name: 'READ', context: 'MESSAGE' },
  ] as const;
  const statuses = [
    // Business statuses
    { context: 'PENDING_REVIEW' },
    { context: 'APPROVED' },
    { context: 'SUSPENDED' },
    { context: 'REJECTED' },
    // Document statuses
    { context: 'DOC_PENDING' },
    { context: 'DOC_ACCEPTED' },
    { context: 'DOC_REJECTED' },
    // Booking statuses
    { context: 'PENDING' },
    { context: 'CONFIRMED' },
    { context: 'VEHICLE_RECEIVED' },
    { context: 'IN_PROGRESS' },
    { context: 'READY_FOR_PICKUP' },
    { context: 'COMPLETED' },
    { context: 'CANCELLED' },
    // Payment statuses
    { context: 'PAYMENT_PENDING' },
    { context: 'PAID' },
    { context: 'REFUNDED' },
    { context: 'FAILED' },
    // Payout statuses
    { context: 'PAYOUT_PENDING' },
    { context: 'PAYOUT_PROCESSED' },
    // Conversation statuses
    { context: 'OPEN' },
    { context: 'CLOSED' },
    // Message statuses
    { context: 'SENT' },
    { context: 'DELIVERED' },
    { context: 'READ' },
  ];

  const statusMap: Record<string, string> = {};

  for (const s of statuses) {
    const existing = await prisma.status.findFirst({
      where: { context: s.context },
    });

    let row;
    if (!existing) {
      row = await prisma.status.create({ data: { context: s.context } });
    } else {
      row = existing;
    }
    statusMap[s.context] = row.id;
  }

  console.log('✅ Statuses created');

  // =====================================================================
  // 3. PAYMENT METHODS
  // =====================================================================
  console.log('\n📦 Creating payment methods...');

  const paymentMethods = ['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'WALLET'];
  const paymentMethodMap: Record<string, string> = {};

  for (const name of paymentMethods) {
    const row = await prisma.paymentMethod.upsert({
      where: { name },
      update: {},
      create: { name, isEnabled: true },
    });
    paymentMethodMap[name] = row.id;
  }

  console.log('✅ Payment methods created');

  // =====================================================================
  // 4. NOTIFICATION TYPES
  // =====================================================================
  console.log('\n📦 Creating notification types...');

  const notificationTypes = [
    { code: 'BOOKING_CONFIRMED', label: 'Booking Confirmed' },
    { code: 'BOOKING_COMPLETED', label: 'Booking Completed' },
    { code: 'BOOKING_REQUESTED', label: 'New Booking Request' },
    { code: 'BOOKING_CANCELLED', label: 'Booking Cancelled' },
    { code: 'VEHICLE_RECEIVED', label: 'Vehicle Received' },
    { code: 'SERVICE_IN_PROGRESS', label: 'Service In Progress' },
    { code: 'READY_FOR_PICKUP', label: 'Ready for Pickup' },
    { code: 'DIAGNOSIS_SENT', label: 'Diagnosis Report Ready' },
    { code: 'PAYMENT_RECEIVED', label: 'Payment Received' },
    { code: 'NEW_REVIEW', label: 'New Review Received' },
    { code: 'PAYOUT_PROCESSED', label: 'Payout Processed' },
    { code: 'LOYALTY_POINTS_EARNED', label: 'Loyalty Points Earned' },
    { code: 'LOYALTY_POINTS_REDEEMED', label: 'Points Redeemed' },
  ];

  const notificationTypeMap: Record<string, string> = {};

  for (const nt of notificationTypes) {
    const row = await prisma.notificationType.upsert({
      where: { code: nt.code },
      update: {},
      create: { code: nt.code, label: nt.label },
    });
    notificationTypeMap[nt.code] = row.id;
  }

  console.log('✅ Notification types created');

  // =====================================================================
  // 5. CATEGORIES & SERVICES
  // =====================================================================
  console.log('\n📦 Creating categories and services...');

  const washCategory = await prisma.category.upsert({
    where: { name: 'Wash' },
    update: {},
    create: { name: 'Wash' },
  });

  const repairCategory = await prisma.category.upsert({
    where: { name: 'Repair' },
    update: {},
    create: { name: 'Repair' },
  });

  const diagnosticsCategory = await prisma.category.upsert({
    where: { name: 'Diagnostics' },
    update: {},
    create: { name: 'Diagnostics' },
  });

  const interiorCategory = await prisma.category.upsert({
    where: { name: 'Interior' },
    update: {},
    create: { name: 'Interior' },
  });

  // Wash Services
  const expressWash = await prisma.service.upsert({
    where: { id: '11111111-1111-1111-1111-111111111111' },
    update: {},
    create: {
      id: '11111111-1111-1111-1111-111111111111',
      categoryId: washCategory.id,
      title: 'Express Wash',
      description: 'Quick exterior wash with premium shampoo and dry.',
    },
  });

  const fullDetail = await prisma.service.upsert({
    where: { id: '11111111-1111-1111-1111-111111111112' },
    update: {},
    create: {
      id: '11111111-1111-1111-1111-111111111112',
      categoryId: washCategory.id,
      title: 'Full Detail',
      description: 'Exterior + interior deep clean with polish and wax.',
    },
  });

  const ceramicWax = await prisma.service.upsert({
    where: { id: '11111111-1111-1111-1111-111111111113' },
    update: {},
    create: {
      id: '11111111-1111-1111-1111-111111111113',
      categoryId: washCategory.id,
      title: 'Ceramic Wax Treatment',
      description: 'Premium wax application with 3-month water beading.',
    },
  });

  // Repair Services
  const oilChange = await prisma.service.upsert({
    where: { id: '11111111-1111-1111-1111-111111111114' },
    update: {},
    create: {
      id: '11111111-1111-1111-1111-111111111114',
      categoryId: repairCategory.id,
      title: 'Oil Change',
      description: 'Full synthetic oil change + filter replacement.',
    },
  });

  const brakeService = await prisma.service.upsert({
    where: { id: '11111111-1111-1111-1111-111111111115' },
    update: {},
    create: {
      id: '11111111-1111-1111-1111-111111111115',
      categoryId: repairCategory.id,
      title: 'Brake Service',
      description: 'Pad inspection, replacement, and fluid check.',
    },
  });

  const acRepair = await prisma.service.upsert({
    where: { id: '11111111-1111-1111-1111-111111111116' },
    update: {},
    create: {
      id: '11111111-1111-1111-1111-111111111116',
      categoryId: repairCategory.id,
      title: 'AC Repair',
      description: 'Pressure test, leak detection, refrigerant top-up.',
    },
  });

  // Diagnostics
  const diagnosticCheck = await prisma.service.upsert({
    where: { id: '11111111-1111-1111-1111-111111111117' },
    update: {},
    create: {
      id: '11111111-1111-1111-1111-111111111117',
      categoryId: diagnosticsCategory.id,
      title: 'Diagnostic Check',
      description: 'Full vehicle inspection with detailed report.',
    },
  });

  // Interior Services
  const interiorCleaning = await prisma.service.upsert({
    where: { id: '11111111-1111-1111-1111-111111111118' },
    update: {},
    create: {
      id: '11111111-1111-1111-1111-111111111118',
      categoryId: interiorCategory.id,
      title: 'Interior Cleaning',
      description: 'Deep clean of seats, carpets, and dashboard.',
    },
  });

  console.log('✅ Categories and services created');

  // =====================================================================
  // 6. USERS
  // =====================================================================
  console.log('\n📦 Creating users...');

  const adminPassword = await hashPassword('Admin@1234!');
  const managerPassword = await hashPassword('Manager@1234!');
  const clientPassword = await hashPassword('Client@1234!');

  // Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@glowfix.com' },
    update: {},
    create: {
      role: 'ADMIN',
      fullName: 'System Administrator',
      email: 'admin@glowfix.com',
      phone: '+201000000001',
      passwordHash: adminPassword,
      emailVerified: true,
      phoneVerified: true,
      twoFactorEnabled: false,
      isActive: true,
    },
  });

  // Managers
  const manager1 = await prisma.user.upsert({
    where: { email: 'manager@shineco.com' },
    update: {},
    create: {
      role: 'MANAGER',
      fullName: 'Ahmed Khalil',
      email: 'manager@shineco.com',
      phone: '+201000000002',
      passwordHash: managerPassword,
      emailVerified: true,
      phoneVerified: true,
      isActive: true,
    },
  });

  const manager2 = await prisma.user.upsert({
    where: { email: 'manager@garage37.com' },
    update: {},
    create: {
      role: 'MANAGER',
      fullName: 'Sara Mansour',
      email: 'manager@garage37.com',
      phone: '+201000000003',
      passwordHash: managerPassword,
      emailVerified: true,
      phoneVerified: true,
      isActive: true,
    },
  });

  const manager3 = await prisma.user.upsert({
    where: { email: 'manager@aquabay.com' },
    update: {},
    create: {
      role: 'MANAGER',
      fullName: 'Omar Nasser',
      email: 'manager@aquabay.com',
      phone: '+201000000004',
      passwordHash: managerPassword,
      emailVerified: true,
      phoneVerified: true,
      isActive: true,
    },
  });

  // Clients
  const client1 = await prisma.user.upsert({
    where: { email: 'mahmoud@example.com' },
    update: {},
    create: {
      role: 'CLIENT',
      fullName: 'Mahmoud Ali',
      email: 'mahmoud@example.com',
      phone: '+201000000010',
      passwordHash: clientPassword,
      emailVerified: true,
      phoneVerified: true,
      isActive: true,
    },
  });

  const client2 = await prisma.user.upsert({
    where: { email: 'sara@example.com' },
    update: {},
    create: {
      role: 'CLIENT',
      fullName: 'Sara Mostafa',
      email: 'sara@example.com',
      phone: '+201000000011',
      passwordHash: clientPassword,
      emailVerified: true,
      phoneVerified: true,
      isActive: true,
    },
  });

  const client3 = await prisma.user.upsert({
    where: { email: 'karim@example.com' },
    update: {},
    create: {
      role: 'CLIENT',
      fullName: 'Karim Hassan',
      email: 'karim@example.com',
      phone: '+201000000012',
      passwordHash: clientPassword,
      emailVerified: true,
      phoneVerified: true,
      isActive: true,
    },
  });

  console.log('✅ Users created');

  // =====================================================================
  // 7. USER AUTH PROVIDERS
  // =====================================================================
  console.log('\n📦 Creating auth providers...');

  await prisma.userAuthProvider.createMany({
    data: [
      { userId: adminUser.id, provider: 'EMAIL', email: adminUser.email },
      { userId: manager1.id, provider: 'EMAIL', email: manager1.email },
      { userId: manager2.id, provider: 'EMAIL', email: manager2.email },
      { userId: manager3.id, provider: 'EMAIL', email: manager3.email },
      { userId: client1.id, provider: 'EMAIL', email: client1.email },
      { userId: client2.id, provider: 'EMAIL', email: client2.email },
      { userId: client3.id, provider: 'EMAIL', email: client3.email },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Auth providers created');

  // =====================================================================
  // 8. CLIENTS (with PostGIS locations)
  // =====================================================================
  console.log('\n📦 Creating clients...');

  const clientRecord1 = await prisma.client.upsert({
    where: { userId: client1.id },
    update: {},
    create: { userId: client1.id },
  });

  const clientRecord2 = await prisma.client.upsert({
    where: { userId: client2.id },
    update: {},
    create: { userId: client2.id },
  });

  const clientRecord3 = await prisma.client.upsert({
    where: { userId: client3.id },
    update: {},
    create: { userId: client3.id },
  });

  // Update locations
  await prisma.$executeRaw`
    UPDATE clients SET location = ST_SetSRID(ST_MakePoint(31.2357, 30.0444), 4326)::geography WHERE user_id = ${client1.id}::uuid
  `;
  await prisma.$executeRaw`
    UPDATE clients SET location = ST_SetSRID(ST_MakePoint(31.2581, 29.9602), 4326)::geography WHERE user_id = ${client2.id}::uuid
  `;
  await prisma.$executeRaw`
    UPDATE clients SET location = ST_SetSRID(ST_MakePoint(31.3228, 30.0892), 4326)::geography WHERE user_id = ${client3.id}::uuid
  `;

  console.log('✅ Clients created');

  // =====================================================================
  // 9. CLIENT VEHICLES
  // =====================================================================
  console.log('\n📦 Creating client vehicles...');

  const vehicle1 = await prisma.clientVehicle.upsert({
    where: { clientId_licensePlate: { clientId: clientRecord1.id, licensePlate: 'ABC-1234' } },
    update: {},
    create: {
      clientId: clientRecord1.id,
      licensePlate: 'ABC-1234',
      model: 'Toyota Corolla',
      year: 2021,
      color: 'Pearl White',
    },
  });

  const vehicle2 = await prisma.clientVehicle.upsert({
    where: { clientId_licensePlate: { clientId: clientRecord1.id, licensePlate: 'XYZ-5678' } },
    update: {},
    create: {
      clientId: clientRecord1.id,
      licensePlate: 'XYZ-5678',
      model: 'Hyundai Tucson',
      year: 2019,
      color: 'Phantom Black',
    },
  });

  const vehicle3 = await prisma.clientVehicle.upsert({
    where: { clientId_licensePlate: { clientId: clientRecord2.id, licensePlate: 'DEF-9012' } },
    update: {},
    create: {
      clientId: clientRecord2.id,
      licensePlate: 'DEF-9012',
      model: 'Honda Civic',
      year: 2022,
      color: 'Red',
    },
  });

  const vehicle4 = await prisma.clientVehicle.upsert({
    where: { clientId_licensePlate: { clientId: clientRecord3.id, licensePlate: 'GHI-3456' } },
    update: {},
    create: {
      clientId: clientRecord3.id,
      licensePlate: 'GHI-3456',
      model: 'Kia Sportage',
      year: 2020,
      color: 'Silver',
    },
  });

  console.log('✅ Client vehicles created');

  // =====================================================================
  // 10. BUSINESSES
  // =====================================================================
  console.log('\n📦 Creating businesses...');

  async function upsertBusiness(id: string, managerId: string, businessName: string, address: string, contactPhone: string, contactEmail: string, lng: number, lat: number) {
    let business = await prisma.business.findUnique({ where: { id } }).catch(() => null);
    if (business) {
      await prisma.$executeRaw`
        UPDATE businesses SET manager_id = ${managerId}::uuid, business_name = ${businessName}, address = ${address}, contact_phone = ${contactPhone}, contact_email = ${contactEmail}, location = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography WHERE id = ${id}::uuid
      `;
    } else {
      await prisma.$executeRaw`
        INSERT INTO businesses (id, manager_id, business_name, address, location, contact_phone, contact_email, created_at, updated_at)
        VALUES (${id}::uuid, ${managerId}::uuid, ${businessName}, ${address}, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography, ${contactPhone}, ${contactEmail}, now(), now())
      `;
    }
    return prisma.business.findUniqueOrThrow({ where: { id } });
  }

  // Business 1: Shine & Co. Detailing (Zamalek)
  const business1 = await upsertBusiness(
    '22222222-2222-2222-2222-222222222221',
    manager1.id, 'Shine & Co. Detailing', '22 26th of July St, Zamalek, Cairo',
    '+20225000001', 'contact@shineco.com', 31.2357, 30.0444,
  );

  // Business 2: Garage 37 Auto Service (Maadi)
  const business2 = await upsertBusiness(
    '22222222-2222-2222-2222-222222222222',
    manager2.id, 'Garage 37 Auto Service', '15 Road 9, Maadi, Cairo',
    '+20225000002', 'contact@garage37.com', 31.2581, 29.9602,
  );

  // Business 3: Aqua Bay Express Wash (Downtown)
  const business3 = await upsertBusiness(
    '22222222-2222-2222-2222-222222222223',
    manager3.id, 'Aqua Bay Express Wash', '123 Tahrir St, Downtown, Cairo',
    '+20225000003', 'contact@aquabay.com', 31.2200, 30.0500,
  );

  console.log('✅ Businesses created');

  // =====================================================================
  // 11. BUSINESS STATUS HISTORY
  // =====================================================================
  console.log('\n📦 Creating business status history...');

  await prisma.businessStatus.createMany({
    data: [
      { businessId: business1.id, statusId: statusMap['PENDING_REVIEW'], createdAt: pastDate(20) },
      { businessId: business1.id, statusId: statusMap['APPROVED'], createdAt: pastDate(15) },
      { businessId: business2.id, statusId: statusMap['PENDING_REVIEW'], createdAt: pastDate(10) },
      { businessId: business2.id, statusId: statusMap['APPROVED'], createdAt: pastDate(8) },
      { businessId: business3.id, statusId: statusMap['PENDING_REVIEW'], createdAt: pastDate(5) },
      { businessId: business3.id, statusId: statusMap['APPROVED'], createdAt: pastDate(3) },
    ],
  });

  console.log('✅ Business status history created');

  // =====================================================================
  // 12. BUSINESS DOCUMENTS
  // =====================================================================
  console.log('\n📦 Creating business documents...');

  await prisma.businessDocument.createMany({
    data: [
      {
        businessId: business1.id,
        type: 'BUSINESS_REGISTRATION',
        url: 'https://cdn.glowfix.com/docs/business1/registration.pdf',
        statusId: statusMap['DOC_ACCEPTED'],
      },
      {
        businessId: business1.id,
        type: 'INSURANCE_CERTIFICATE',
        url: 'https://cdn.glowfix.com/docs/business1/insurance.pdf',
        statusId: statusMap['DOC_ACCEPTED'],
      },
      {
        businessId: business2.id,
        type: 'BUSINESS_REGISTRATION',
        url: 'https://cdn.glowfix.com/docs/business2/registration.pdf',
        statusId: statusMap['DOC_PENDING'],
      },
      {
        businessId: business3.id,
        type: 'BUSINESS_REGISTRATION',
        url: 'https://cdn.glowfix.com/docs/business3/registration.pdf',
        statusId: statusMap['DOC_PENDING'],
      },
    ],
  });

  console.log('✅ Business documents created');

  // =====================================================================
  // 13. OPERATING HOURS
  // =====================================================================
  console.log('\n📦 Creating operating hours...');

  // Business 1 hours (Sun-Thu 9-6, Fri 9-8, Sat closed)
  const hoursData = [
    { businessId: business1.id, dayOfWeek: 0, openTime: '09:00', closeTime: '18:00' },
    { businessId: business1.id, dayOfWeek: 1, openTime: '09:00', closeTime: '18:00' },
    { businessId: business1.id, dayOfWeek: 2, openTime: '09:00', closeTime: '18:00' },
    { businessId: business1.id, dayOfWeek: 3, openTime: '09:00', closeTime: '18:00' },
    { businessId: business1.id, dayOfWeek: 4, openTime: '09:00', closeTime: '18:00' },
    { businessId: business1.id, dayOfWeek: 5, openTime: '09:00', closeTime: '20:00' },
    { businessId: business1.id, dayOfWeek: 6, openTime: null, closeTime: null },
    // Business 2 hours (Mon-Sat 8-7, Sun closed)
    { businessId: business2.id, dayOfWeek: 0, openTime: null, closeTime: null },
    { businessId: business2.id, dayOfWeek: 1, openTime: '08:00', closeTime: '19:00' },
    { businessId: business2.id, dayOfWeek: 2, openTime: '08:00', closeTime: '19:00' },
    { businessId: business2.id, dayOfWeek: 3, openTime: '08:00', closeTime: '19:00' },
    { businessId: business2.id, dayOfWeek: 4, openTime: '08:00', closeTime: '19:00' },
    { businessId: business2.id, dayOfWeek: 5, openTime: '08:00', closeTime: '19:00' },
    { businessId: business2.id, dayOfWeek: 6, openTime: '09:00', closeTime: '15:00' },
    // Business 3 hours (24/7)
    { businessId: business3.id, dayOfWeek: 0, openTime: '00:00', closeTime: '23:59' },
    { businessId: business3.id, dayOfWeek: 1, openTime: '00:00', closeTime: '23:59' },
    { businessId: business3.id, dayOfWeek: 2, openTime: '00:00', closeTime: '23:59' },
    { businessId: business3.id, dayOfWeek: 3, openTime: '00:00', closeTime: '23:59' },
    { businessId: business3.id, dayOfWeek: 4, openTime: '00:00', closeTime: '23:59' },
    { businessId: business3.id, dayOfWeek: 5, openTime: '00:00', closeTime: '23:59' },
    { businessId: business3.id, dayOfWeek: 6, openTime: '00:00', closeTime: '23:59' },
  ];

  for (const hours of hoursData) {
    await prisma.operatingHour.upsert({
      where: {
        businessId_dayOfWeek: { businessId: hours.businessId, dayOfWeek: hours.dayOfWeek },
      },
      update: {},
      create: hours,
    });
  }

  console.log('✅ Operating hours created');

  // =====================================================================
  // 14. BUSINESS SERVICES (Manager assigns price & duration)
  // =====================================================================
  console.log('\n📦 Creating business services...');

  async function upsertBusinessService(businessId: string, serviceId: string, price: number, averageDuration: number) {
    return prisma.businessService.upsert({
      where: { businessId_serviceId: { businessId, serviceId } },
      update: { price, averageDuration, isActive: true },
      create: { businessId, serviceId, price, averageDuration, isActive: true },
    });
  }

  // Business 1 services
  const bs1ExpressWash = await upsertBusinessService(business1.id, expressWash.id, 12000, 30);
  const bs1FullDetail = await upsertBusinessService(business1.id, fullDetail.id, 32000, 120);
  const bs1CeramicWax = await upsertBusinessService(business1.id, ceramicWax.id, 48000, 180);
  const bs1Diagnostic = await upsertBusinessService(business1.id, diagnosticCheck.id, 0, 45);

  // Business 2 services
  const bs2OilChange = await upsertBusinessService(business2.id, oilChange.id, 25000, 45);
  const bs2BrakeService = await upsertBusinessService(business2.id, brakeService.id, 45000, 90);
  const bs2ACRepair = await upsertBusinessService(business2.id, acRepair.id, 28000, 60);
  const bs2Diagnostic = await upsertBusinessService(business2.id, diagnosticCheck.id, 0, 45);

  // Business 3 services
  const bs3ExpressWash = await upsertBusinessService(business3.id, expressWash.id, 8000, 20);
  const bs3Interior = await upsertBusinessService(business3.id, interiorCleaning.id, 15000, 45);

  console.log('✅ Business services created');

  // =====================================================================
  // 15. LOYALTY CONFIG
  // =====================================================================
  console.log('\n📦 Creating loyalty config...');

  await prisma.loyaltyConfig.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      pointsPer100Egp: 100,
      egpPerPoint: 0.1,
      maxRedeemPct: 50,
      isActive: true,
    },
  });

  console.log('✅ Loyalty config created');

  // =====================================================================
  // 16. BOOKINGS
  // =====================================================================
  console.log('\n📦 Creating bookings...');

  // Booking 1 - Completed (Mahmoud -> Shine & Co. - Full Detail)
  const booking1 = await prisma.booking.create({
    data: {
      vehicleId: vehicle1.id,
      businessId: business1.id,
      scheduledAt: pastDate(7),
      expectedDeliveryAt: pastDate(7),
      subTotal: 32000,
      discount: 0,
      commission: 3200,
      totalPrice: 32000,
    },
  });

  // Booking 2 - Confirmed Upcoming (Mahmoud -> Shine & Co. - Ceramic Wax)
  const booking2 = await prisma.booking.create({
    data: {
      vehicleId: vehicle1.id,
      businessId: business1.id,
      scheduledAt: futureDate(2),
      subTotal: 48000,
      discount: 4800, // 10% loyalty discount
      commission: 4800,
      totalPrice: 43200,
    },
  });

  // Booking 3 - In Progress (Sara -> Garage 37 - Diagnostic)
  const booking3 = await prisma.booking.create({
    data: {
      vehicleId: vehicle3.id,
      businessId: business2.id,
      scheduledAt: pastDate(1),
      subTotal: 0,
      discount: 0,
      commission: 0,
      totalPrice: 0,
    },
  });

  // Booking 4 - Pending (Karim -> Aqua Bay - Express Wash)
  const booking4 = await prisma.booking.create({
    data: {
      vehicleId: vehicle4.id,
      businessId: business3.id,
      scheduledAt: futureDate(3),
      subTotal: 8000,
      discount: 0,
      commission: 800,
      totalPrice: 8000,
    },
  });

  // Booking 5 - Cancelled (Mahmoud -> Garage 37 - Brake Service)
  const booking5 = await prisma.booking.create({
    data: {
      vehicleId: vehicle2.id,
      businessId: business2.id,
      scheduledAt: pastDate(10),
      subTotal: 45000,
      discount: 0,
      commission: 4500,
      totalPrice: 45000,
    },
  });

  console.log('✅ Bookings created');

  // =====================================================================
  // 17. BOOKING STATUS HISTORY
  // =====================================================================
  console.log('\n📦 Creating booking status history...');

  // Booking 1 - Completed
  await prisma.bookingStatus.createMany({
    data: [
      { bookingId: booking1.id, statusId: statusMap['PENDING'], createdAt: pastDate(8) },
      { bookingId: booking1.id, statusId: statusMap['CONFIRMED'], createdAt: pastDate(8) },
      { bookingId: booking1.id, statusId: statusMap['VEHICLE_RECEIVED'], createdAt: pastDate(7) },
      { bookingId: booking1.id, statusId: statusMap['IN_PROGRESS'], createdAt: pastDate(7) },
      { bookingId: booking1.id, statusId: statusMap['READY_FOR_PICKUP'], createdAt: pastDate(7) },
      { bookingId: booking1.id, statusId: statusMap['COMPLETED'], createdAt: pastDate(7) },
    ],
  });

  // Booking 2 - Confirmed
  await prisma.bookingStatus.createMany({
    data: [
      { bookingId: booking2.id, statusId: statusMap['PENDING'], createdAt: pastDate(3) },
      { bookingId: booking2.id, statusId: statusMap['CONFIRMED'], createdAt: pastDate(2) },
    ],
  });

  // Booking 3 - In Progress
  await prisma.bookingStatus.createMany({
    data: [
      { bookingId: booking3.id, statusId: statusMap['PENDING'], createdAt: pastDate(2) },
      { bookingId: booking3.id, statusId: statusMap['CONFIRMED'], createdAt: pastDate(2) },
      { bookingId: booking3.id, statusId: statusMap['VEHICLE_RECEIVED'], createdAt: pastDate(1) },
      { bookingId: booking3.id, statusId: statusMap['IN_PROGRESS'], createdAt: pastDate(1) },
    ],
  });

  // Booking 4 - Pending
  await prisma.bookingStatus.create({
    data: { bookingId: booking4.id, statusId: statusMap['PENDING'] },
  });

  // Booking 5 - Cancelled
  await prisma.bookingStatus.createMany({
    data: [
      { bookingId: booking5.id, statusId: statusMap['PENDING'], createdAt: pastDate(12) },
      { bookingId: booking5.id, statusId: statusMap['CONFIRMED'], createdAt: pastDate(11) },
      { bookingId: booking5.id, statusId: statusMap['CANCELLED'], createdAt: pastDate(10) },
    ],
  });

  console.log('✅ Booking status history created');

  // =====================================================================
  // 18. BOOKING ITEMS
  // =====================================================================
  console.log('\n📦 Creating booking items...');

  await prisma.bookingItem.createMany({
    data: [
      { bookingId: booking1.id, businessServiceId: bs1FullDetail.id, price: 32000 },
      { bookingId: booking2.id, businessServiceId: bs1CeramicWax.id, price: 48000 },
      { bookingId: booking3.id, businessServiceId: bs2Diagnostic.id, price: 0 },
      { bookingId: booking4.id, businessServiceId: bs3ExpressWash.id, price: 8000 },
      { bookingId: booking5.id, businessServiceId: bs2BrakeService.id, price: 45000 },
    ],
  });

  console.log('✅ Booking items created');

  // =====================================================================
  // 19. BOOKING CANCELLATIONS
  // =====================================================================
  console.log('\n📦 Creating booking cancellation...');

  await prisma.bookingCancellation.upsert({
    where: { bookingId: booking5.id },
    update: {},
    create: {
      bookingId: booking5.id,
      cancelledBy: client1.id,
      cancelledAt: pastDate(10),
      reason: 'Change of plans - found a better offer elsewhere',
    },
  });

  console.log('✅ Booking cancellation created');

  // =====================================================================
  // 20. BOOKING NOTES
  // =====================================================================
  console.log('\n📦 Creating booking notes...');

  await prisma.bookingNote.create({
    data: {
      bookingId: booking2.id,
      body: 'Please check the air filters and tire pressure as well.',
    },
  });

  await prisma.bookingNote.create({
    data: {
      bookingId: booking3.id,
      body: 'Customer reported engine warning light and unusual noise.',
    },
  });

  console.log('✅ Booking notes created');

  // =====================================================================
  // 21. PAYMENTS
  // =====================================================================
  console.log('\n📦 Creating payments...');

  // Payment for completed booking
  const payment1 = await prisma.payment.upsert({
    where: { idempotencyKey: 'idem_001' },
    update: {},
    create: {
      bookingId: booking1.id,
      paymentMethodId: paymentMethodMap['CREDIT_CARD'],
      provider: 'stripe',
      providerRef: 'pi_completed_001',
      amount: 32000,
      currency: 'EGP',
      statusId: statusMap['PAID'],
      idempotencyKey: 'idem_001',
      createdAt: pastDate(6),
    },
  });

  // Payment for confirmed booking
  const payment2 = await prisma.payment.upsert({
    where: { idempotencyKey: 'idem_002' },
    update: {},
    create: {
      bookingId: booking2.id,
      paymentMethodId: paymentMethodMap['CREDIT_CARD'],
      provider: 'stripe',
      providerRef: 'pi_pending_002',
      amount: 43200,
      currency: 'EGP',
      statusId: statusMap['PAYMENT_PENDING'],
      idempotencyKey: 'idem_002',
    },
  });

  console.log('✅ Payments created');

  // =====================================================================
  // 22. PAYOUTS
  // =====================================================================
  console.log('\n📦 Creating payouts...');

  const payout1 = await prisma.payout.create({
    data: {
      businessId: business1.id,
      amount: 28800, // 32000 - 3200 commission
      statusId: statusMap['PAYOUT_PROCESSED'],
      processedAt: pastDate(5),
    },
  });

  await prisma.payoutBooking.upsert({
    where: { payoutId_bookingId: { payoutId: payout1.id, bookingId: booking1.id } },
    update: {},
    create: {
      payoutId: payout1.id,
      bookingId: booking1.id,
    },
  });

  console.log('✅ Payouts created');

  // =====================================================================
  // 23. DIAGNOSTIC REPORT (for booking 3)
  // =====================================================================
  console.log('\n📦 Creating diagnostic report...');

  const report = await prisma.diagnosticReport.upsert({
    where: { bookingId: booking3.id },
    update: {},
    create: {
      bookingId: booking3.id,
      summary: 'Vehicle shows minor oil leak and worn brake pads. Engine warning light indicates O2 sensor issue.',
      validUntil: futureDate(3),
      estimatedDuration: 240,
    },
  });

  // Findings
  await prisma.reportFinding.createMany({
    data: [
      {
        reportId: report.id,
        title: 'Oil Leak - Rear Main Seal',
        description: 'Minor seepage visible around the rear main seal. Monitor and check oil levels weekly.',
        priority: 'WARNING',
      },
      {
        reportId: report.id,
        title: 'Brake Pads - Front Axle',
        description: 'Front brake pads at 15% thickness. Immediate replacement recommended.',
        priority: 'CRITICAL',
      },
      {
        reportId: report.id,
        title: 'O2 Sensor - Bank 1',
        description: 'Faulty oxygen sensor causing check engine light.',
        priority: 'WARNING',
      },
    ],
  });

  // Recommended repairs
  await prisma.recommendedRepair.createMany({
    data: [
      { reportId: report.id, businessServiceId: bs2BrakeService.id },
      { reportId: report.id, businessServiceId: bs2Diagnostic.id },
    ],
  });

  console.log('✅ Diagnostic report created');

  // =====================================================================
  // 24. REVIEWS
  // =====================================================================
  console.log('\n📦 Creating reviews...');

  await prisma.review.upsert({
    where: { bookingId: booking1.id },
    update: {},
    create: {
      bookingId: booking1.id,
      rating: 5,
      qualityRating: 5,
      punctualityRating: 4,
      communicationRating: 5,
      comment: 'Excellent service! Car looks brand new. Highly recommend Shine & Co.!',
    },
  });

  console.log('✅ Reviews created');

  // =====================================================================
  // 25. LOYALTY TRANSACTIONS
  // =====================================================================
  console.log('\n📦 Creating loyalty transactions...');

  // Points earned from booking 1 (320 EGP = 320 points)
  await prisma.loyaltyTransaction.create({
    data: {
      clientId: clientRecord1.id,
      bookingId: booking1.id,
      type: 'EARNED',
      points: 320,
      reason: 'Earned 320 points from Full Detail booking',
    },
  });

  // Points redeemed on booking 2 (480 EGP, 10% discount = 480 points = 48 EGP)
  await prisma.loyaltyTransaction.create({
    data: {
      clientId: clientRecord1.id,
      bookingId: booking2.id,
      type: 'REDEEMED',
      points: -480,
      reason: 'Redeemed 480 points for 10% discount on Ceramic Wax Treatment',
    },
  });

  // Points earned from booking 4 (80 EGP = 80 points)
  await prisma.loyaltyTransaction.create({
    data: {
      clientId: clientRecord3.id,
      bookingId: booking4.id,
      type: 'EARNED',
      points: 80,
      reason: 'Earned 80 points from Express Wash booking',
    },
  });

  console.log('✅ Loyalty transactions created');

  // =====================================================================
  // 26. NOTIFICATIONS
  // =====================================================================
  console.log('\n📦 Creating notifications...');

  await prisma.notification.createMany({
    data: [
      {
        recipientUserId: client1.id,
        actorUserId: null,
        typeId: notificationTypeMap['BOOKING_CONFIRMED'],
        title: 'Booking Confirmed',
        body: 'Your Full Detail booking with Shine & Co. has been confirmed.',
        actionUrl: '/bookings/GF-0001',
        sentAt: pastDate(7),
      },
      {
        recipientUserId: client1.id,
        actorUserId: null,
        typeId: notificationTypeMap['BOOKING_COMPLETED'],
        title: 'Booking Completed',
        body: 'Your vehicle is ready for pickup. Booking GF-0001 is completed.',
        actionUrl: '/bookings/GF-0001',
        sentAt: pastDate(7),
      },
      {
        recipientUserId: manager1.id,
        actorUserId: client1.id,
        typeId: notificationTypeMap['BOOKING_REQUESTED'],
        title: 'New Booking Request',
        body: 'Mahmoud Ali requested a Ceramic Wax Treatment for 2 days from now.',
        actionUrl: '/dashboard/bookings',
        sentAt: pastDate(3),
      },
      {
        recipientUserId: manager1.id,
        actorUserId: client1.id,
        typeId: notificationTypeMap['NEW_REVIEW'],
        title: 'New Review Received',
        body: 'You received a 5-star review from Mahmoud Ali.',
        actionUrl: '/dashboard/reviews',
        sentAt: pastDate(6),
      },
      {
        recipientUserId: client3.id,
        actorUserId: null,
        typeId: notificationTypeMap['LOYALTY_POINTS_EARNED'],
        title: 'Loyalty Points Earned!',
        body: 'You earned 80 points from your Express Wash booking.',
        actionUrl: '/loyalty',
        sentAt: pastDate(1),
      },
    ],
  });

  console.log('✅ Notifications created');

  // =====================================================================
  // 27. CONVERSATIONS & MESSAGES
  // =====================================================================
  console.log('\n📦 Creating conversations and messages...');

  // Conversation for booking 2
  const conversation = await prisma.conversation.create({
    data: {
      bookingId: booking2.id,
      type: 'BOOKING',
      statusId: statusMap['OPEN'],
    },
  });

  // Participants
  await prisma.conversationParticipant.createMany({
    data: [
      { conversationId: conversation.id, userId: client1.id, role: 'CLIENT' },
      { conversationId: conversation.id, userId: manager1.id, role: 'MANAGER' },
    ],
  });

  // Messages
  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation.id,
        senderUserId: null,
        senderRole: 'SYSTEM',
        type: 'TEXT',
        body: 'Booking GF-0002 has been confirmed. You can now chat with the workshop.',
        statusId: statusMap['SENT'],
        createdAt: pastDate(2),
      },
      {
        conversationId: conversation.id,
        senderUserId: client1.id,
        senderRole: 'CLIENT',
        type: 'TEXT',
        body: 'Hi, please check the air filters while the car is in.',
        statusId: statusMap['SENT'],
        createdAt: pastDate(1),
      },
      {
        conversationId: conversation.id,
        senderUserId: manager1.id,
        senderRole: 'MANAGER',
        type: 'TEXT',
        body: 'Sure! We will inspect the air filters and let you know.',
        statusId: statusMap['DELIVERED'],
        deliveredAt: pastDate(1),
        createdAt: pastDate(1),
      },
    ],
  });

  console.log('✅ Conversations and messages created');

  // =====================================================================
  // 28. IMAGES (Gallery & Avatars)
  // =====================================================================
  console.log('\n📦 Creating images...');

  // Business gallery images
  await prisma.image.createMany({
    data: [
      {
        url: 'https://cdn.glowfix.com/gallery/business1/shop-front.jpg',
        storageKey: 'gallery/business1/shop-front.jpg',
        entityType: 'BUSINESS_GALLERY',
        entityId: business1.id,
      },
      {
        url: 'https://cdn.glowfix.com/gallery/business1/interior.jpg',
        storageKey: 'gallery/business1/interior.jpg',
        entityType: 'BUSINESS_GALLERY',
        entityId: business1.id,
      },
      {
        url: 'https://cdn.glowfix.com/gallery/business2/workshop.jpg',
        storageKey: 'gallery/business2/workshop.jpg',
        entityType: 'BUSINESS_GALLERY',
        entityId: business2.id,
      },
    ],
  });

  console.log('✅ Images created');

  // =====================================================================
  // 29. AUDIT LOGS
  // =====================================================================
  console.log('\n📦 Creating audit logs...');

  await prisma.auditLog.createMany({
    data: [
      {
        actorId: adminUser.id,
        entityType: 'BUSINESS',
        entityId: business1.id,
        action: 'APPROVED',
        newData: { status: 'APPROVED' },
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        createdAt: pastDate(15),
      },
      {
        actorId: client1.id,
        entityType: 'BOOKING',
        entityId: booking1.id,
        action: 'CREATED',
        newData: { status: 'PENDING' },
        ipAddress: '192.168.1.100',
        createdAt: pastDate(8),
      },
      {
        actorId: manager1.id,
        entityType: 'BOOKING',
        entityId: booking2.id,
        action: 'STATUS_CHANGED',
        oldData: { status: 'PENDING' },
        newData: { status: 'CONFIRMED' },
        ipAddress: '192.168.1.50',
        createdAt: pastDate(2),
      },
    ],
  });

  console.log('✅ Audit logs created');

  // =====================================================================
  // 30. USER SESSIONS
  // =====================================================================
  console.log('\n📦 Creating user sessions...');

  await prisma.userSession.upsert({
    where: { tokenHash: 'mock_token_hash_for_client1' },
    update: {},
    create: {
      userId: client1.id,
      tokenHash: 'mock_token_hash_for_client1',
      deviceInfo: 'Chrome on macOS',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      expiresAt: futureDate(30),
      lastUsedAt: new Date(),
    },
  });

  console.log('✅ User sessions created');

  // =====================================================================
  // 31. REJECTION REASONS (Example)
  // =====================================================================
  console.log('\n📦 Creating rejection reasons...');

  await prisma.rejectionReason.create({
    data: {
      entityType: 'BUSINESS_DOCUMENT',
      entityId: business2.id,
      reasonText: 'Insurance certificate expired. Please upload a valid document.',
    },
  });

  console.log('✅ Rejection reasons created');

  // =====================================================================
  // Complete
  // =====================================================================
  console.log('\n' + '='.repeat(50));
  console.log('🎉 SEED COMPLETED SUCCESSFULLY! 🎉');
  console.log('='.repeat(50));
  console.log('\n📋 Test Accounts:');
  console.log('   Admin:    admin@glowfix.com / Admin@1234!');
  console.log('   Manager:  manager@shineco.com / Manager@1234!');
  console.log('   Client:   mahmoud@example.com / Client@1234!');
  console.log('\n📍 Business Locations:');
  console.log('   Shine & Co. Detailing - Zamalek (31.2357, 30.0444)');
  console.log('   Garage 37 Auto Service - Maadi (31.2581, 29.9602)');
  console.log('   Aqua Bay Express Wash - Downtown (31.2200, 30.0500)');
  console.log('\n🚗 Vehicles:');
  console.log('   Mahmoud: Toyota Corolla (ABC-1234), Hyundai Tucson (XYZ-5678)');
  console.log('   Sara: Honda Civic (DEF-9012)');
  console.log('   Karim: Kia Sportage (GHI-3456)');
}

// =====================================================================
// Run the seed
// =====================================================================

main()
  .catch((e) => {
  console.error('\n❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });