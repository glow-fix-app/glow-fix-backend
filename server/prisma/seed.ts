// prisma/seed.ts - Corrected version
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import process from 'process';

const prisma = new PrismaClient();

// =====================================================================
// Helper Functions
// =====================================================================

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

function hashSha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
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

function generateRawToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// =====================================================================
// Main Seed
// =====================================================================

async function main() {
  console.log('🌱 Seeding Glowfix database…');

  // =====================================================================
  // 1. GLOBAL SETTINGS
  // =====================================================================

  await prisma.setting.upsert({
    where: { id: '00000000-0000-0000-0000-000000000000' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000000',
      businessFeePct: 10.0,
      maxCancelMinutes: 120,
    },
  });

  console.log('✅ Settings created');

  // =====================================================================
  // 2. STATUS LOOKUP ROWS
  // =====================================================================

  const statusDefs = [
    { name: 'PENDING_REVIEW', context: 'BUSINESS' },
    { name: 'APPROVED', context: 'BUSINESS' },
    { name: 'SUSPENDED', context: 'BUSINESS' },
    { name: 'REJECTED', context: 'BUSINESS' },
    { name: 'PENDING', context: 'DOCUMENT' },
    { name: 'APPROVED', context: 'DOCUMENT' },
    { name: 'REJECTED', context: 'DOCUMENT' },
    { name: 'PENDING', context: 'BOOKING' },
    { name: 'CONFIRMED', context: 'BOOKING' },
    { name: 'VEHICLE_RECEIVED', context: 'BOOKING' },
    { name: 'INSPECTION_IN_PROGRESS', context: 'BOOKING' },
    { name: 'WAITING_CLIENT_APPROVAL', context: 'BOOKING' },
    { name: 'REPAIR_IN_PROGRESS', context: 'BOOKING' },
    { name: 'READY_FOR_PICKUP', context: 'BOOKING' },
    { name: 'COMPLETED', context: 'BOOKING' },
    { name: 'CANCELLED', context: 'BOOKING' },
    { name: 'PENDING', context: 'PAYMENT' },
    { name: 'PAID', context: 'PAYMENT' },
    { name: 'REFUNDED', context: 'PAYMENT' },
    { name: 'FAILED', context: 'PAYMENT' },
    { name: 'PENDING', context: 'PAYOUT' },
    { name: 'PROCESSED', context: 'PAYOUT' },
    { name: 'FAILED', context: 'PAYOUT' },
    { name: 'OPEN', context: 'CONVERSATION' },
    { name: 'CLOSED', context: 'CONVERSATION' },
    { name: 'SENT', context: 'MESSAGE' },
    { name: 'DELIVERED', context: 'MESSAGE' },
    { name: 'READ', context: 'MESSAGE' },
  ] as const;

  const statusMap: Record<string, string> = {};
  for (const s of statusDefs) {
    const existing = await prisma.status.findFirst({
      where: { context: s.context, name: s.name },
    });

    let row;
    if (!existing) {
      row = await prisma.status.create({
        data: { context: s.context, name: s.name },
      });
    } else {
      row = existing;
    }
    statusMap[`${s.context}:${s.name}`] = row.id;
  }

  console.log('✅ Status lookup rows created');

  // =====================================================================
  // 3. PAYMENT METHODS
  // =====================================================================

  const paymentMethods = [
    'CASH',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'WALLET',
  ] as const;
  const pmMap: Record<string, string> = {};
  for (const name of paymentMethods) {
    const row = await prisma.paymentMethod.upsert({
      where: { name },
      update: {},
      create: { name, isEnabled: true },
    });
    pmMap[name] = row.id;
  }

  console.log('✅ Payment methods created');

  // =====================================================================
  // 4. NOTIFICATION TYPES
  // =====================================================================

  const notificationTypeDefs = [
    { code: 'BOOKING_CONFIRMED', label: 'Booking Confirmed' },
    { code: 'BOOKING_COMPLETED', label: 'Booking Completed' },
    { code: 'BOOKING_REQUESTED', label: 'New Booking Request' },
    { code: 'BOOKING_CANCELLED', label: 'Booking Cancelled' },
    { code: 'NEW_REVIEW', label: 'New Review Received' },
    { code: 'PAYOUT_PROCESSED', label: 'Payout Processed' },
  ] as const;

  const ntMap: Record<string, string> = {};
  for (const nt of notificationTypeDefs) {
    const row = await prisma.notificationType.upsert({
      where: { code: nt.code },
      update: {},
      create: { code: nt.code, label: nt.label },
    });
    ntMap[nt.code] = row.id;
  }

  console.log('✅ Notification types created');

  // =====================================================================
  // 5. CATEGORIES & SERVICES
  // =====================================================================

  const carWashCategory = await prisma.category.upsert({
    where: { name: 'Car Wash' },
    update: {},
    create: { name: 'Car Wash' },
  });

  const oilChangeCategory = await prisma.category.upsert({
    where: { name: 'Oil Change' },
    update: {},
    create: { name: 'Oil Change' },
  });

  const tiresCategory = await prisma.category.upsert({
    where: { name: 'Tires' },
    update: {},
    create: { name: 'Tires' },
  });

  const diagnosticsCategory = await prisma.category.upsert({
    where: { name: 'Diagnostics' },
    update: {},
    create: { name: 'Diagnostics' },
  });

  const detailingCategory = await prisma.category.upsert({
    where: { name: 'Detailing' },
    update: {},
    create: { name: 'Detailing' },
  });

  const svcExteriorWash = await prisma.service.upsert({
    where: { id: '00000000-0000-0000-0001-000000000001' },
    update: {
      categoryId: carWashCategory.id,
      title: 'Exterior Wash',
      description: 'Full exterior hand wash with foam and rinse.',
    },
    create: {
      id: '00000000-0000-0000-0001-000000000001',
      categoryId: carWashCategory.id,
      title: 'Exterior Wash',
      description: 'Full exterior hand wash with foam and rinse.',
    },
  });

  const svcInteriorWash = await prisma.service.upsert({
    where: { id: '00000000-0000-0000-0001-000000000002' },
    update: {
      categoryId: carWashCategory.id,
      title: 'Interior Wash',
      description: 'Vacuum, wipe-down, and interior refresh for passenger areas.',
    },
    create: {
      id: '00000000-0000-0000-0001-000000000002',
      categoryId: carWashCategory.id,
      title: 'Interior Wash',
      description: 'Vacuum, wipe-down, and interior refresh for passenger areas.',
    },
  });

  const svcFullWash = await prisma.service.upsert({
    where: { id: '00000000-0000-0000-0001-000000000003' },
    update: {
      categoryId: carWashCategory.id,
      title: 'Full Wash',
      description: 'Complete interior and exterior wash package.',
    },
    create: {
      id: '00000000-0000-0000-0001-000000000003',
      categoryId: carWashCategory.id,
      title: 'Full Wash',
      description: 'Complete interior and exterior wash package.',
    },
  });

  const svcEngineWash = await prisma.service.upsert({
    where: { id: '00000000-0000-0000-0001-000000000004' },
    update: {
      categoryId: carWashCategory.id,
      title: 'Engine Wash',
      description: 'Careful engine bay cleaning and degreasing service.',
    },
    create: {
      id: '00000000-0000-0000-0001-000000000004',
      categoryId: carWashCategory.id,
      title: 'Engine Wash',
      description: 'Careful engine bay cleaning and degreasing service.',
    },
  });

  const svcStandardOilChange = await prisma.service.upsert({
    where: { id: '00000000-0000-0000-0001-000000000005' },
    update: {
      categoryId: oilChangeCategory.id,
      title: 'Standard Oil Change',
      description: 'Conventional oil replacement with standard inspection.',
    },
    create: {
      id: '00000000-0000-0000-0001-000000000005',
      categoryId: oilChangeCategory.id,
      title: 'Standard Oil Change',
      description: 'Conventional oil replacement with standard inspection.',
    },
  });

  const svcSyntheticOilChange = await prisma.service.upsert({
    where: { id: '00000000-0000-0000-0001-000000000006' },
    update: {
      categoryId: oilChangeCategory.id,
      title: 'Synthetic Oil Change',
      description: 'Premium synthetic oil replacement with filter check.',
    },
    create: {
      id: '00000000-0000-0000-0001-000000000006',
      categoryId: oilChangeCategory.id,
      title: 'Synthetic Oil Change',
      description: 'Premium synthetic oil replacement with filter check.',
    },
  });

  const svcOilFilterReplacement = await prisma.service.upsert({
    where: { id: '00000000-0000-0000-0001-000000000007' },
    update: {
      categoryId: oilChangeCategory.id,
      title: 'Oil Filter Replacement',
      description: 'Standalone oil filter replacement service.',
    },
    create: {
      id: '00000000-0000-0000-0001-000000000007',
      categoryId: oilChangeCategory.id,
      title: 'Oil Filter Replacement',
      description: 'Standalone oil filter replacement service.',
    },
  });

  const svcTireChange = await prisma.service.upsert({
    where: { id: '00000000-0000-0000-0001-000000000008' },
    update: {
      categoryId: tiresCategory.id,
      title: 'Tire Change',
      description: 'Removal and installation of replacement tires.',
    },
    create: {
      id: '00000000-0000-0000-0001-000000000008',
      categoryId: tiresCategory.id,
      title: 'Tire Change',
      description: 'Removal and installation of replacement tires.',
    },
  });

  const svcTireRotation = await prisma.service.upsert({
    where: { id: '00000000-0000-0000-0001-000000000009' },
    update: {
      categoryId: tiresCategory.id,
      title: 'Tire Rotation',
      description: 'Rotate tires to improve tread wear and lifespan.',
    },
    create: {
      id: '00000000-0000-0000-0001-000000000009',
      categoryId: tiresCategory.id,
      title: 'Tire Rotation',
      description: 'Rotate tires to improve tread wear and lifespan.',
    },
  });

  const svcWheelBalancing = await prisma.service.upsert({
    where: { id: '00000000-0000-0000-0001-000000000010' },
    update: {
      categoryId: tiresCategory.id,
      title: 'Wheel Balancing',
      description: 'Wheel balancing service for smoother driving.',
    },
    create: {
      id: '00000000-0000-0000-0001-000000000010',
      categoryId: tiresCategory.id,
      title: 'Wheel Balancing',
      description: 'Wheel balancing service for smoother driving.',
    },
  });

  const svcComputerDiagnostics = await prisma.service.upsert({
    where: { id: '00000000-0000-0000-0001-000000000011' },
    update: {
      categoryId: diagnosticsCategory.id,
      title: 'Computer Diagnostics',
      description: 'OBD-II scan with fault code analysis and report.',
    },
    create: {
      id: '00000000-0000-0000-0001-000000000011',
      categoryId: diagnosticsCategory.id,
      title: 'Computer Diagnostics',
      description: 'OBD-II scan with fault code analysis and report.',
    },
  });

  const svcBatteryCheck = await prisma.service.upsert({
    where: { id: '00000000-0000-0000-0001-000000000012' },
    update: {
      categoryId: diagnosticsCategory.id,
      title: 'Battery Check',
      description: 'Battery voltage and charging system inspection.',
    },
    create: {
      id: '00000000-0000-0000-0001-000000000012',
      categoryId: diagnosticsCategory.id,
      title: 'Battery Check',
      description: 'Battery voltage and charging system inspection.',
    },
  });

  const svcBrakeInspection = await prisma.service.upsert({
    where: { id: '00000000-0000-0000-0001-000000000013' },
    update: {
      categoryId: diagnosticsCategory.id,
      title: 'Brake Inspection',
      description: 'Brake pad, rotor, and fluid safety inspection.',
    },
    create: {
      id: '00000000-0000-0000-0001-000000000013',
      categoryId: diagnosticsCategory.id,
      title: 'Brake Inspection',
      description: 'Brake pad, rotor, and fluid safety inspection.',
    },
  });

  const svcInteriorDetailing = await prisma.service.upsert({
    where: { id: '00000000-0000-0000-0001-000000000014' },
    update: {
      categoryId: detailingCategory.id,
      title: 'Interior Detailing',
      description: 'Deep-clean interior detailing with fabric and surface care.',
    },
    create: {
      id: '00000000-0000-0000-0001-000000000014',
      categoryId: detailingCategory.id,
      title: 'Interior Detailing',
      description: 'Deep-clean interior detailing with fabric and surface care.',
    },
  });

  const svcExteriorPolishing = await prisma.service.upsert({
    where: { id: '00000000-0000-0000-0001-000000000015' },
    update: {
      categoryId: detailingCategory.id,
      title: 'Exterior Polishing',
      description: 'Paint polishing for gloss enhancement and swirl reduction.',
    },
    create: {
      id: '00000000-0000-0000-0001-000000000015',
      categoryId: detailingCategory.id,
      title: 'Exterior Polishing',
      description: 'Paint polishing for gloss enhancement and swirl reduction.',
    },
  });

  const svcFullDetail = svcInteriorDetailing;
  const svcEngineDiagnosis = svcComputerDiagnostics;
  const svcOilChange = svcSyntheticOilChange;

  console.log('✅ Categories and services created');

  // =====================================================================
  // 6. USERS - FIXED: Using bcrypt for passwords
  // =====================================================================

  console.log('📝 Creating users with bcrypt passwords...');

  // Generate bcrypt hashes
  const adminPasswordHash = await bcrypt.hash('Admin@1234!', 12);
  const managerPasswordHash = await bcrypt.hash('Manager@1234!', 12);
  const manager2PasswordHash = await bcrypt.hash('Manager@5678!', 12);
  const clientPasswordHash = await bcrypt.hash('Client@1234!', 12);
  const client2PasswordHash = await bcrypt.hash('Client@5678!', 12);

  console.log('✅ Password hashes generated');

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@glowfix.io' },
    update: {},
    create: {
      role: 'ADMIN',
      fullName: 'Glowfix Admin',
      email: 'admin@glowfix.io',
      passwordHash: await bcrypt.hash('Admin@1234!', 12), // ← This is correct
      emailVerified: true,
      twoFactorEnabled: false,
      isActive: true,
    },
  });

  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@glowfix.io' },
    update: {},
    create: {
      role: 'MANAGER',
      fullName: 'Ahmed Khalil',
      email: 'manager@glowfix.io',
      phone: '+201001234567',
      passwordHash: managerPasswordHash,
      emailVerified: true,
      phoneVerified: true,
      isActive: true,
    },
  });

  const manager2User = await prisma.user.upsert({
    where: { email: 'manager2@glowfix.io' },
    update: {},
    create: {
      role: 'MANAGER',
      fullName: 'Sara Mansour',
      email: 'manager2@glowfix.io',
      phone: '+201009876543',
      passwordHash: manager2PasswordHash,
      emailVerified: true,
      phoneVerified: true,
      isActive: true,
    },
  });

  const clientUser = await prisma.user.upsert({
    where: { email: 'client@glowfix.io' },
    update: {},
    create: {
      role: 'CLIENT',
      fullName: 'Omar Nasser',
      email: 'client@glowfix.io',
      phone: '+201112223344',
      passwordHash: clientPasswordHash,
      emailVerified: true,
      phoneVerified: true,
      isActive: true,
    },
  });

  const client2User = await prisma.user.upsert({
    where: { email: 'client2@glowfix.io' },
    update: {},
    create: {
      role: 'CLIENT',
      fullName: 'Layla Hassan',
      email: 'client2@glowfix.io',
      phone: '+201556667788',
      passwordHash: client2PasswordHash,
      emailVerified: true,
      isActive: true,
    },
  });

  console.log('✅ Users created');
  console.log(`   Admin: admin@glowfix.io / Admin@1234!`);
  console.log(`   Manager: manager@glowfix.io / Manager@1234!`);
  console.log(`   Client: client@glowfix.io / Client@1234!`);

  // =====================================================================
  // 7. AUTH PROVIDERS
  // =====================================================================

  await prisma.userAuthProvider.upsert({
    where: { userId_provider: { userId: adminUser.id, provider: 'EMAIL' } },
    update: {},
    create: { userId: adminUser.id, provider: 'EMAIL', email: adminUser.email },
  });

  await prisma.userAuthProvider.upsert({
    where: { userId_provider: { userId: managerUser.id, provider: 'EMAIL' } },
    update: {},
    create: {
      userId: managerUser.id,
      provider: 'EMAIL',
      email: managerUser.email,
    },
  });

  await prisma.userAuthProvider.upsert({
    where: { userId_provider: { userId: manager2User.id, provider: 'EMAIL' } },
    update: {},
    create: {
      userId: manager2User.id,
      provider: 'EMAIL',
      email: manager2User.email,
    },
  });

  await prisma.userAuthProvider.upsert({
    where: { userId_provider: { userId: clientUser.id, provider: 'EMAIL' } },
    update: {},
    create: {
      userId: clientUser.id,
      provider: 'EMAIL',
      email: clientUser.email,
    },
  });

  await prisma.userAuthProvider.upsert({
    where: { userId_provider: { userId: client2User.id, provider: 'GOOGLE' } },
    update: {},
    create: {
      userId: client2User.id,
      provider: 'GOOGLE',
      providerUserId: 'google-sub-layla-001',
      email: client2User.email,
    },
  });

  console.log('✅ Auth providers created');

  // =====================================================================
  // 8. USER SESSIONS
  // =====================================================================

  const rawToken = generateRawToken();

  await prisma.userSession.create({
    data: {
      userId: adminUser.id,
      tokenHash: hashSha256(rawToken),
      deviceInfo: 'Chrome on macOS',
      ipAddress: '197.60.1.1',
      userAgent: 'Mozilla/5.0',
      expiresAt: futureDate(30),
      lastUsedAt: new Date(),
    },
  });

  console.log('✅ Sessions created');

  // =====================================================================
  // 9. CLIENTS
  // =====================================================================

  const client1 = await prisma.client.upsert({
    where: { userId: clientUser.id },
    update: {},
    create: { userId: clientUser.id },
  });

  const client2 = await prisma.client.upsert({
    where: { userId: client2User.id },
    update: {},
    create: { userId: client2User.id },
  });

  // Patch Omar's location to Maadi
  await prisma.$executeRaw`
    UPDATE clients
    SET    location = ST_MakePoint(31.2581, 29.9602)::geography
    WHERE  id = ${client1.id}::uuid
  `;

  // Patch Layla's location to Heliopolis
  await prisma.$executeRaw`
    UPDATE clients
    SET    location = ST_MakePoint(31.3228, 30.0892)::geography
    WHERE  id = ${client2.id}::uuid
  `;

  console.log('✅ Clients created + locations set');

  // =====================================================================
  // 10. CLIENT VEHICLES
  // =====================================================================

  const vehicle1 = await prisma.clientVehicle.upsert({
    where: {
      clientId_licensePlate: { clientId: client1.id, licensePlate: 'ABC-1234' },
    },
    update: {},
    create: {
      clientId: client1.id,
      licensePlate: 'ABC-1234',
      model: 'Toyota Corolla',
      year: 2020,
      color: 'White',
    },
  });

  const vehicle2 = await prisma.clientVehicle.upsert({
    where: {
      clientId_licensePlate: { clientId: client1.id, licensePlate: 'XYZ-5678' },
    },
    update: {},
    create: {
      clientId: client1.id,
      licensePlate: 'XYZ-5678',
      model: 'Honda Civic',
      year: 2022,
      color: 'Black',
    },
  });

  const vehicle3 = await prisma.clientVehicle.upsert({
    where: {
      clientId_licensePlate: { clientId: client2.id, licensePlate: 'GHI-9999' },
    },
    update: {},
    create: {
      clientId: client2.id,
      licensePlate: 'GHI-9999',
      model: 'Kia Sportage',
      year: 2021,
      color: 'Silver',
    },
  });

  console.log('✅ Vehicles created');

  // =====================================================================
  // 11. BUSINESSES
  // =====================================================================

  const business1Id = '00000000-0000-0000-0000-000000000001';
  const business2Id = '00000000-0000-0000-0000-000000000002';

  await prisma.$executeRaw`
    INSERT INTO businesses (
      id, manager_id, business_name, address, location,
      contact_phone, contact_email, created_at, updated_at
    ) VALUES (
      ${business1Id}::uuid,
      ${managerUser.id}::uuid,
      'GlowFix Maadi',
      '15 Road 9, Maadi, Cairo',
      ST_MakePoint(31.2581, 29.9602)::geography,
      '+20225000001',
      'maadi@glowfix.io',
      now(), now()
    ) ON CONFLICT (id) DO NOTHING
  `;

  await prisma.$executeRaw`
    INSERT INTO businesses (
      id, manager_id, business_name, address, location,
      contact_phone, contact_email, created_at, updated_at
    ) VALUES (
      ${business2Id}::uuid,
      ${manager2User.id}::uuid,
      'GlowFix Heliopolis',
      '7 El Merghany St, Heliopolis, Cairo',
      ST_MakePoint(31.3228, 30.0892)::geography,
      '+20225000002',
      'heliopolis@glowfix.io',
      now(), now()
    ) ON CONFLICT (id) DO NOTHING
  `;

  const business1 = await prisma.business.findUniqueOrThrow({
    where: { id: business1Id },
  });
  const business2 = await prisma.business.findUniqueOrThrow({
    where: { id: business2Id },
  });

  console.log('✅ Businesses created + locations set');

  // =====================================================================
  // 12. BUSINESS STATUS HISTORY
  // =====================================================================

  const b1StatusCount = await prisma.businessStatus.count({
    where: { businessId: business1.id }
  });
  if (b1StatusCount === 0) {
    await prisma.businessStatus.createMany({
      data: [
        {
          businessId: business1.id,
          statusId: statusMap['BUSINESS:PENDING_REVIEW'],
          createdAt: pastDate(15),
        },
        {
          businessId: business1.id,
          statusId: statusMap['BUSINESS:APPROVED'],
          createdAt: pastDate(10),
        },
      ],
    });
  }

  const b2StatusCount = await prisma.businessStatus.count({
    where: { businessId: business2.id }
  });
  if (b2StatusCount === 0) {
    await prisma.businessStatus.createMany({
      data: [
        {
          businessId: business2.id,
          statusId: statusMap['BUSINESS:PENDING_REVIEW'],
          createdAt: pastDate(10),
        },
        {
          businessId: business2.id,
          statusId: statusMap['BUSINESS:APPROVED'],
          createdAt: pastDate(5),
        },
      ],
    });
  }

  console.log('✅ Business status history created');

  // =====================================================================
  // 13. BUSINESS DOCUMENTS
  // =====================================================================

  const docTypes = [
    'BUSINESS_REGISTRATION',
    'INSURANCE_CERTIFICATE',
    'TAX_CARD',
  ] as const;

  for (const type of docTypes) {
    const existingDoc = await prisma.businessDocument.findFirst({
      where: { businessId: business1.id, type }
    });
    if (!existingDoc) {
      await prisma.businessDocument.create({
        data: {
          businessId: business1.id,
          type,
          url: `https://cdn.glowfix.io/docs/business1/${type.toLowerCase()}.pdf`,
          statusId: statusMap['DOCUMENT:APPROVED'],
        },
      });
    }
  }

  console.log('✅ Business documents created');

  // =====================================================================
  // 14. OPERATING HOURS  (business1 — Sun–Thu open, Fri–Sat closed)
  // =====================================================================

  const schedule = [
    { day: 0, open: '09:00', close: '18:00' },
    { day: 1, open: '09:00', close: '18:00' },
    { day: 2, open: '09:00', close: '18:00' },
    { day: 3, open: '09:00', close: '18:00' },
    { day: 4, open: '09:00', close: '18:00' },
    { day: 5, open: null, close: null },
    { day: 6, open: null, close: null },
  ];

  for (const s of schedule) {
    await prisma.operatingHour.upsert({
      where: {
        businessId_dayOfWeek: { businessId: business1.id, dayOfWeek: s.day },
      },
      update: {
        openTime: s.open ?? null,
        closeTime: s.close ?? null,
      },
      create: {
        businessId: business1.id,
        dayOfWeek: s.day,
        openTime: s.open ?? null,
        closeTime: s.close ?? null,
      },
    });
  }

  console.log('✅ Operating hours created');

  // =====================================================================
  // 15. BUSINESS SERVICES (catalog matrix)
  // =====================================================================

  const seededBusinessServices = [
    { serviceId: svcExteriorWash.id, price: 15000n, averageDuration: 30, isActive: true },
    { serviceId: svcInteriorWash.id, price: 18000n, averageDuration: 40, isActive: true },
    { serviceId: svcFullWash.id, price: 26000n, averageDuration: 55, isActive: true },
    { serviceId: svcEngineWash.id, price: 22000n, averageDuration: 45, isActive: false },
    { serviceId: svcComputerDiagnostics.id, price: 20000n, averageDuration: 60, isActive: true },
    { serviceId: svcSyntheticOilChange.id, price: 25000n, averageDuration: 45, isActive: true },
    { serviceId: svcTireRotation.id, price: 16000n, averageDuration: 35, isActive: true },
    { serviceId: svcInteriorDetailing.id, price: 45000n, averageDuration: 120, isActive: true },
  ];

  for (const seededBusinessService of seededBusinessServices) {
    await prisma.businessService.upsert({
      where: {
        businessId_serviceId: {
          businessId: business1.id,
          serviceId: seededBusinessService.serviceId,
        },
      },
      update: {
        price: seededBusinessService.price,
        averageDuration: seededBusinessService.averageDuration,
        isActive: seededBusinessService.isActive,
      },
      create: {
        businessId: business1.id,
        serviceId: seededBusinessService.serviceId,
        price: seededBusinessService.price,
        averageDuration: seededBusinessService.averageDuration,
        isActive: seededBusinessService.isActive,
      },
    });
  }

  console.log('✅ Business services assigned');

  // =====================================================================
  // 16. DEMO BOOKINGS & DIAGNOSTIC REPORTS
  // =====================================================================

  const bsExteriorWash = await prisma.businessService.findFirstOrThrow({
    where: {
      businessId: business1.id,
      serviceId: svcExteriorWash.id,
    },
  });

  const bsFullDetail = await prisma.businessService.findFirstOrThrow({
    where: {
      businessId: business1.id,
      serviceId: svcFullDetail.id,
    },
  });

  const bsEngineDiagnosis = await prisma.businessService.findFirstOrThrow({
    where: {
      businessId: business1.id,
      serviceId: svcEngineDiagnosis.id,
    },
  });

  const bsOilChange = await prisma.businessService.findFirstOrThrow({
    where: {
      businessId: business1.id,
      serviceId: svcOilChange.id,
    },
  });

  // Seed Booking 1: PENDING
  const existingB1 = await prisma.booking.findUnique({
    where: { id: '00000000-0000-0000-0002-000000000001' },
  });
  if (!existingB1) {
    const booking1 = await prisma.booking.create({
      data: {
        id: '00000000-0000-0000-0002-000000000001',
        vehicleId: vehicle1.id,
        businessId: business1.id,
        scheduledAt: futureDate(1),
        subTotal: 15000n,
        totalPrice: 15000n,
        commission: 1500n,
      },
    });

    await prisma.bookingItem.create({
      data: {
        bookingId: booking1.id,
        businessServiceId: bsExteriorWash.id,
        price: 15000n,
      },
    });

    await prisma.bookingStatus.create({
      data: {
        bookingId: booking1.id,
        statusId: statusMap['BOOKING:PENDING'],
      },
    });
  }

  // Seed Booking 2: WAITING_CLIENT_APPROVAL + diagnostics
  const existingB2 = await prisma.booking.findUnique({
    where: { id: '00000000-0000-0000-0002-000000000002' },
  });
  if (!existingB2) {
    const booking2 = await prisma.booking.create({
      data: {
        id: '00000000-0000-0000-0002-000000000002',
        vehicleId: vehicle2.id,
        businessId: business1.id,
        scheduledAt: futureDate(2),
        subTotal: 65000n,
        totalPrice: 65000n,
        commission: 6500n,
      },
    });

    await prisma.bookingItem.createMany({
      data: [
        {
          bookingId: booking2.id,
          businessServiceId: bsEngineDiagnosis.id,
          price: 20000n,
        },
        {
          bookingId: booking2.id,
          businessServiceId: bsFullDetail.id,
          price: 45000n,
        },
      ],
    });

    const timeline = [
      'BOOKING:PENDING',
      'BOOKING:CONFIRMED',
      'BOOKING:VEHICLE_RECEIVED',
      'BOOKING:INSPECTION_IN_PROGRESS',
      'BOOKING:WAITING_CLIENT_APPROVAL',
    ];
    for (let i = 0; i < timeline.length; i++) {
      await prisma.bookingStatus.create({
        data: {
          bookingId: booking2.id,
          statusId: statusMap[timeline[i]],
          createdAt: pastDate(timeline.length - i),
        },
      });
    }

    const report = await prisma.diagnosticReport.create({
      data: {
        bookingId: booking2.id,
        summary: 'Engine warning light is on. Recommend cleaning fuel injector and spark plug replacements.',
        validUntil: futureDate(10),
        estimatedDuration: 180,
      },
    });

    await prisma.reportFinding.createMany({
      data: [
        {
          reportId: report.id,
          title: 'Misfiring in Cylinder 2',
          description: 'Spark plug shows heavy carbon deposits.',
          priority: 'CRITICAL',
        },
        {
          reportId: report.id,
          title: 'Low windshield washer fluid',
          description: 'Just needs topping up.',
          priority: 'INFO',
        },
      ],
    });

    await prisma.recommendedRepair.create({
      data: {
        reportId: report.id,
        businessServiceId: bsOilChange.id,
      },
    });
  }

  // Seed Booking 3: COMPLETED
  const existingB3 = await prisma.booking.findUnique({
    where: { id: '00000000-0000-0000-0002-000000000003' },
  });
  if (!existingB3) {
    const booking3 = await prisma.booking.create({
      data: {
        id: '00000000-0000-0000-0002-000000000003',
        vehicleId: vehicle3.id,
        businessId: business1.id,
        scheduledAt: pastDate(3),
        expectedDeliveryAt: pastDate(3),
        subTotal: 25000n,
        totalPrice: 25000n,
        commission: 2500n,
      },
    });

    await prisma.bookingItem.create({
      data: {
        bookingId: booking3.id,
        businessServiceId: bsOilChange.id,
        price: 25000n,
      },
    });

    const timeline = [
      'BOOKING:PENDING',
      'BOOKING:CONFIRMED',
      'BOOKING:VEHICLE_RECEIVED',
      'BOOKING:INSPECTION_IN_PROGRESS',
      'BOOKING:WAITING_CLIENT_APPROVAL',
      'BOOKING:REPAIR_IN_PROGRESS',
      'BOOKING:READY_FOR_PICKUP',
      'BOOKING:COMPLETED',
    ];
    for (let i = 0; i < timeline.length; i++) {
      await prisma.bookingStatus.create({
        data: {
          bookingId: booking3.id,
          statusId: statusMap[timeline[i]],
          createdAt: pastDate(timeline.length - i),
        },
      });
    }
  }

  console.log('✅ Demo bookings and diagnostic reports seeded');

  console.log('\n🎉 Glowfix seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// // =====================================================================
// // GLOWFIX — DATABASE SEED  (aligned with current schema.prisma)
// // Run with: npx prisma db seed
// // =====================================================================

// import { PrismaClient } from '@prisma/client';
// import * as crypto from 'crypto';
// import process from 'process';

// const prisma = new PrismaClient();

// // -----------------------------------------------------------------------
// // Helpers
// // -----------------------------------------------------------------------

// function hashSha256(value: string): string {
//   return crypto.createHash('sha256').update(value).digest('hex');
// }

// function futureDate(daysFromNow: number): Date {
//   const d = new Date();
//   d.setDate(d.getDate() + daysFromNow);
//   return d;
// }

// function pastDate(daysAgo: number): Date {
//   const d = new Date();
//   d.setDate(d.getDate() - daysAgo);
//   return d;
// }

// // -----------------------------------------------------------------------
// // Main seed
// // -----------------------------------------------------------------------

// async function main() {
//   console.log('🌱 Seeding Glowfix database…');

//   // =====================================================================
//   // 1. GLOBAL SETTINGS
//   // =====================================================================

//   await prisma.setting.upsert({
//     where: { id: '00000000-0000-0000-0000-000000000000' },
//     update: {},
//     create: {
//       id: '00000000-0000-0000-0000-000000000000',
//       businessFeePct: 10.0,
//       maxCancelMinutes: 120,
//     },
//   });

//   console.log('✅ Settings created');

//   // =====================================================================
//   // 2. STATUS LOOKUP ROWS
//   // Each context group: BUSINESS | DOCUMENT | BOOKING | PAYMENT | CONVERSATION | MESSAGE
//   // =====================================================================

//   const statusDefs = [
//     // Business statuses
//     { name: 'PENDING_REVIEW', context: 'BUSINESS' },
//     { name: 'APPROVED', context: 'BUSINESS' },
//     { name: 'SUSPENDED', context: 'BUSINESS' },
//     { name: 'REJECTED', context: 'BUSINESS' },
//     // Document statuses
//     { name: 'DOC_PENDING', context: 'DOCUMENT' },
//     { name: 'DOC_ACCEPTED', context: 'DOCUMENT' },
//     { name: 'DOC_REJECTED', context: 'DOCUMENT' },
//     // Booking statuses
//     { name: 'PENDING', context: 'BOOKING' },
//     { name: 'CONFIRMED', context: 'BOOKING' },
//     { name: 'VEHICLE_RECEIVED', context: 'BOOKING' },
//     { name: 'IN_PROGRESS', context: 'BOOKING' },
//     { name: 'READY_FOR_PICKUP', context: 'BOOKING' },
//     { name: 'COMPLETED', context: 'BOOKING' },
//     { name: 'CANCELLED', context: 'BOOKING' },
//     // Payment statuses
//     { name: 'PAYMENT_PENDING', context: 'PAYMENT' },
//     { name: 'PAID', context: 'PAYMENT' },
//     { name: 'REFUNDED', context: 'PAYMENT' },
//     { name: 'FAILED', context: 'PAYMENT' },
//     // Payout statuses
//     { name: 'PAYOUT_PENDING', context: 'PAYMENT' },
//     { name: 'PAYOUT_PROCESSED', context: 'PAYMENT' },
//     // Conversation statuses
//     { name: 'OPEN', context: 'CONVERSATION' },
//     { name: 'CLOSED', context: 'CONVERSATION' },
//     // Message statuses
//     { name: 'SENT', context: 'MESSAGE' },
//     { name: 'DELIVERED', context: 'MESSAGE' },
//     { name: 'READ', context: 'MESSAGE' },
//   ] as const;

//   const statusMap: Record<string, string> = {};
//   for (const s of statusDefs) {
//     const existing = await prisma.status.findFirst({
//       where: {
//         context: s.context,
//       },
//     });

//     let row;

//     if (!existing) {
//       row = await prisma.status.create({
//         data: {
//           context: s.context,
//         },
//       });
//     } else {
//       row = existing;
//     }

//     statusMap[s.name] = row.id;
//   }

//   console.log('✅ Status lookup rows created');

//   // =====================================================================
//   // 3. PAYMENT METHODS
//   // =====================================================================

//   const paymentMethods = [
//     'CASH',
//     'CREDIT_CARD',
//     'DEBIT_CARD',
//     'WALLET',
//   ] as const;
//   const pmMap: Record<string, string> = {};
//   for (const name of paymentMethods) {
//     const row = await prisma.paymentMethod.upsert({
//       where: { name },
//       update: {},
//       create: { name, isEnabled: true },
//     });
//     pmMap[name] = row.id;
//   }

//   console.log('✅ Payment methods created');

//   // =====================================================================
//   // 4. NOTIFICATION TYPES
//   // =====================================================================

//   const notificationTypeDefs = [
//     { code: 'BOOKING_CONFIRMED', label: 'Booking Confirmed' },
//     { code: 'BOOKING_COMPLETED', label: 'Booking Completed' },
//     { code: 'BOOKING_REQUESTED', label: 'New Booking Request' },
//     { code: 'BOOKING_CANCELLED', label: 'Booking Cancelled' },
//     { code: 'NEW_REVIEW', label: 'New Review Received' },
//     { code: 'PAYOUT_PROCESSED', label: 'Payout Processed' },
//   ] as const;

//   const ntMap: Record<string, string> = {};
//   for (const nt of notificationTypeDefs) {
//     const row = await prisma.notificationType.upsert({
//       where: { code: nt.code },
//       update: {},
//       create: { code: nt.code, label: nt.label },
//     });
//     ntMap[nt.code] = row.id;
//   }

//   console.log('✅ Notification types created');

//   // =====================================================================
//   // 5. CATEGORIES & SERVICES
//   // =====================================================================

//   const washCategory = await prisma.category.upsert({
//     where: { name: 'Wash' },
//     update: {},
//     create: { name: 'Wash' },
//   });

//   const repairCategory = await prisma.category.upsert({
//     where: { name: 'Repair' },
//     update: {},
//     create: { name: 'Repair' },
//   });

//   const diagnosticsCategory = await prisma.category.upsert({
//     where: { name: 'Diagnostics' },
//     update: {},
//     create: { name: 'Diagnostics' },
//   });

//   const svcExteriorWash = await prisma.service.upsert({
//     where: { id: '00000000-0000-0000-0001-000000000001' },
//     update: {},
//     create: {
//       id: '00000000-0000-0000-0001-000000000001',
//       categoryId: washCategory.id,
//       title: 'Exterior Wash',
//       description: 'Full exterior hand wash with foam and rinse.',
//     },
//   });

//   const svcFullDetail = await prisma.service.upsert({
//     where: { id: '00000000-0000-0000-0001-000000000002' },
//     update: {},
//     create: {
//       id: '00000000-0000-0000-0001-000000000002',
//       categoryId: washCategory.id,
//       title: 'Full Detail Package',
//       description: 'Interior + exterior deep clean with polish.',
//     },
//   });

//   const svcEngineDiagnosis = await prisma.service.upsert({
//     where: { id: '00000000-0000-0000-0001-000000000003' },
//     update: {},
//     create: {
//       id: '00000000-0000-0000-0001-000000000003',
//       categoryId: diagnosticsCategory.id,
//       title: 'Engine Diagnosis',
//       description: 'OBD-II scan + mechanic inspection report.',
//     },
//   });

//   const svcOilChange = await prisma.service.upsert({
//     where: { id: '00000000-0000-0000-0001-000000000004' },
//     update: {},
//     create: {
//       id: '00000000-0000-0000-0001-000000000004',
//       categoryId: repairCategory.id,
//       title: 'Oil Change',
//       description: 'Full synthetic oil change + filter replacement.',
//     },
//   });

//   const svcQuickWash = await prisma.service.upsert({
//     where: { id: '00000000-0000-0000-0001-000000000005' },
//     update: {},
//     create: {
//       id: '00000000-0000-0000-0001-000000000005',
//       categoryId: washCategory.id,
//       title: 'Quick Wash',
//       description: 'Express exterior wash in under 20 minutes.',
//     },
//   });

//   console.log('✅ Categories and services created');

//   // =====================================================================
//   // 6. USERS
//   // =====================================================================

//   const adminUser = await prisma.user.upsert({
//     where: { email: 'admin@glowfix.io' },
//     update: {},
//     create: {
//       role: 'ADMIN',
//       fullName: 'Glowfix Admin',
//       email: 'admin@glowfix.io',
//       passwordHash: hashSha256('Admin@1234!'),
//       emailVerified: true,
//       twoFactorEnabled: false,
//       isActive: true,
//     },
//   });

//   const managerUser = await prisma.user.upsert({
//     where: { email: 'manager@glowfix.io' },
//     update: {},
//     create: {
//       role: 'MANAGER',
//       fullName: 'Ahmed Khalil',
//       email: 'manager@glowfix.io',
//       phone: '+201001234567',
//       passwordHash: hashSha256('Manager@1234!'),
//       emailVerified: true,
//       phoneVerified: true,
//       isActive: true,
//     },
//   });

//   const manager2User = await prisma.user.upsert({
//     where: { email: 'manager2@glowfix.io' },
//     update: {},
//     create: {
//       role: 'MANAGER',
//       fullName: 'Sara Mansour',
//       email: 'manager2@glowfix.io',
//       phone: '+201009876543',
//       passwordHash: hashSha256('Manager@5678!'),
//       emailVerified: true,
//       phoneVerified: true,
//       isActive: true,
//     },
//   });

//   const clientUser = await prisma.user.upsert({
//     where: { email: 'client@glowfix.io' },
//     update: {},
//     create: {
//       role: 'CLIENT',
//       fullName: 'Omar Nasser',
//       email: 'client@glowfix.io',
//       phone: '+201112223344',
//       passwordHash: hashSha256('Client@1234!'),
//       emailVerified: true,
//       phoneVerified: true,
//       isActive: true,
//     },
//   });

//   const client2User = await prisma.user.upsert({
//     where: { email: 'client2@glowfix.io' },
//     update: {},
//     create: {
//       role: 'CLIENT',
//       fullName: 'Layla Hassan',
//       email: 'client2@glowfix.io',
//       phone: '+201556667788',
//       passwordHash: hashSha256('Client@5678!'),
//       emailVerified: true,
//       isActive: true,
//     },
//   });

//   console.log('✅ Users created');

//   // =====================================================================
//   // 7. AUTH PROVIDERS
//   // =====================================================================

//   await prisma.userAuthProvider.upsert({
//     where: { userId_provider: { userId: adminUser.id, provider: 'EMAIL' } },
//     update: {},
//     create: { userId: adminUser.id, provider: 'EMAIL', email: adminUser.email },
//   });

//   await prisma.userAuthProvider.upsert({
//     where: { userId_provider: { userId: managerUser.id, provider: 'EMAIL' } },
//     update: {},
//     create: {
//       userId: managerUser.id,
//       provider: 'EMAIL',
//       email: managerUser.email,
//     },
//   });

//   await prisma.userAuthProvider.upsert({
//     where: { userId_provider: { userId: clientUser.id, provider: 'EMAIL' } },
//     update: {},
//     create: {
//       userId: clientUser.id,
//       provider: 'EMAIL',
//       email: clientUser.email,
//     },
//   });

//   await prisma.userAuthProvider.upsert({
//     where: { userId_provider: { userId: client2User.id, provider: 'GOOGLE' } },
//     update: {},
//     create: {
//       userId: client2User.id,
//       provider: 'GOOGLE',
//       providerUserId: 'google-sub-layla-001',
//       email: client2User.email,
//     },
//   });

//   console.log('✅ Auth providers created');

//   function generateRawToken() {
//     return crypto.randomBytes(32).toString('hex');
//   }

//   function hashToken(token: string) {
//     return hashSha256(token);
//   }

//   // =====================================================================
//   // 8. USER SESSIONS
//   // =====================================================================

//   const rawToken = generateRawToken();

//   await prisma.userSession.create({
//     data: {
//       userId: adminUser.id,
//       tokenHash: hashToken(rawToken),
//       deviceInfo: 'Chrome on macOS',
//       ipAddress: '197.60.1.1',
//       userAgent: 'Mozilla/5.0',
//       expiresAt: futureDate(30),
//       lastUsedAt: new Date(),
//     },
//   });

//   console.log('✅ Sessions created');
//   // // =====================================================================
//   // // 8. USER SESSIONS
//   // // =====================================================================

//   // await prisma.userSession.create({
//   //   data: {
//   //     userId: adminUser.id,
//   //     tokenHash: hashSha256("admin-refresh-token-seed"),
//   //     deviceInfo: "Chrome on macOS",
//   //     ipAddress: "197.60.1.1",
//   //     userAgent: "Mozilla/5.0",
//   //     expiresAt: futureDate(30),
//   //     lastUsedAt: new Date(),
//   //   },
//   // });

//   // console.log("✅ Sessions created");

//   // =====================================================================
//   // 9. CLIENTS
//   // The `location` column is a PostGIS geography type (Unsupported in Prisma).
//   // We upsert the row first (location gets its DB default = Cairo centre),
//   // then patch the coordinates via $executeRaw for users who need a
//   // specific position.
//   // =====================================================================

//   const client1 = await prisma.client.upsert({
//     where: { userId: clientUser.id },
//     update: {},
//     create: { userId: clientUser.id },
//   });

//   const client2 = await prisma.client.upsert({
//     where: { userId: client2User.id },
//     update: {},
//     create: { userId: client2User.id },
//   });

//   // Patch Omar's location to Maadi
//   await prisma.$executeRaw`
//     UPDATE clients
//     SET    location = ST_MakePoint(31.2581, 29.9602)::geography
//     WHERE  id = ${client1.id}::uuid
//   `;

//   // Patch Layla's location to Heliopolis
//   await prisma.$executeRaw`
//     UPDATE clients
//     SET    location = ST_MakePoint(31.3228, 30.0892)::geography
//     WHERE  id = ${client2.id}::uuid
//   `;

//   console.log('✅ Clients created + locations set');

//   // =====================================================================
//   // 10. CLIENT VEHICLES
//   // =====================================================================

//   const vehicle1 = await prisma.clientVehicle.upsert({
//     where: {
//       clientId_licensePlate: { clientId: client1.id, licensePlate: 'ABC-1234' },
//     },
//     update: {},
//     create: {
//       clientId: client1.id,
//       licensePlate: 'ABC-1234',
//       model: 'Toyota Corolla',
//       year: 2020,
//       color: 'White',
//     },
//   });

//   const vehicle2 = await prisma.clientVehicle.upsert({
//     where: {
//       clientId_licensePlate: { clientId: client1.id, licensePlate: 'XYZ-5678' },
//     },
//     update: {},
//     create: {
//       clientId: client1.id,
//       licensePlate: 'XYZ-5678',
//       model: 'Honda Civic',
//       year: 2022,
//       color: 'Black',
//     },
//   });

//   const vehicle3 = await prisma.clientVehicle.upsert({
//     where: {
//       clientId_licensePlate: { clientId: client2.id, licensePlate: 'GHI-9999' },
//     },
//     update: {},
//     create: {
//       clientId: client2.id,
//       licensePlate: 'GHI-9999',
//       model: 'Kia Sportage',
//       year: 2021,
//       color: 'Silver',
//     },
//   });

//   console.log('✅ Vehicles created');

//   // =====================================================================
//   // 11. BUSINESSES
//   // Same pattern as clients: create first (location defaults to Cairo),
//   // then patch coordinates via $executeRaw.
//   // =====================================================================

//   const business1Id = '00000000-0000-0000-0000-000000000001';
//   const business2Id = '00000000-0000-0000-0000-000000000002';

//   await prisma.$executeRaw`
//     INSERT INTO businesses (
//       id, manager_id, business_name, address, location,
//       contact_phone, contact_email, created_at, updated_at
//     ) VALUES (
//       ${business1Id}::uuid,
//       ${managerUser.id}::uuid,
//       'GlowFix Maadi',
//       '15 Road 9, Maadi, Cairo',
//       ST_MakePoint(31.2581, 29.9602)::geography,
//       '+20225000001',
//       'maadi@glowfix.io',
//       now(), now()
//     ) ON CONFLICT (id) DO NOTHING
//   `;

//   await prisma.$executeRaw`
//     INSERT INTO businesses (
//       id, manager_id, business_name, address, location,
//       contact_phone, contact_email, created_at, updated_at
//     ) VALUES (
//       ${business2Id}::uuid,
//       ${manager2User.id}::uuid,
//       'GlowFix Heliopolis',
//       '7 El Merghany St, Heliopolis, Cairo',
//       ST_MakePoint(31.3228, 30.0892)::geography,
//       '+20225000002',
//       'heliopolis@glowfix.io',
//       now(), now()
//     ) ON CONFLICT (id) DO NOTHING
//   `;

//   const business1 = await prisma.business.findUniqueOrThrow({
//     where: { id: business1Id },
//   });
//   const business2 = await prisma.business.findUniqueOrThrow({
//     where: { id: business2Id },
//   });

//   console.log('✅ Businesses created + locations set');

//   // =====================================================================
//   // 12. BUSINESS STATUS HISTORY
//   // =====================================================================

//   await prisma.businessStatus.createMany({
//     data: [
//       {
//         businessId: business1.id,
//         statusId: statusMap['PENDING_REVIEW'],
//         createdAt: pastDate(15),
//       },
//       {
//         businessId: business1.id,
//         statusId: statusMap['APPROVED'],
//         createdAt: pastDate(10),
//       },
//       {
//         businessId: business2.id,
//         statusId: statusMap['PENDING_REVIEW'],
//         createdAt: pastDate(10),
//       },
//       {
//         businessId: business2.id,
//         statusId: statusMap['APPROVED'],
//         createdAt: pastDate(5),
//       },
//     ],
//   });

//   console.log('✅ Business status history created');

//   // =====================================================================
//   // 13. BUSINESS DOCUMENTS
//   // =====================================================================

//   const docTypes = [
//     'BUSINESS_REGISTRATION',
//     'INSURANCE_CERTIFICATE',
//     'TAX_CARD',
//   ] as const;

//   for (const type of docTypes) {
//     await prisma.businessDocument.create({
//       data: {
//         businessId: business1.id,
//         type,
//         url: `https://cdn.glowfix.io/docs/business1/${type.toLowerCase()}.pdf`,
//         statusId: statusMap['DOC_ACCEPTED'],
//       },
//     });
//   }

//   console.log('✅ Business documents created');

//   // =====================================================================
//   // 14. OPERATING HOURS  (business1 — Sun–Thu open, Fri–Sat closed)
//   // =====================================================================

//   const schedule = [
//     { day: 0, open: '09:00', close: '18:00' },
//     { day: 1, open: '09:00', close: '18:00' },
//     { day: 2, open: '09:00', close: '18:00' },
//     { day: 3, open: '09:00', close: '18:00' },
//     { day: 4, open: '09:00', close: '18:00' },
//     { day: 5, open: null, close: null },
//     { day: 6, open: null, close: null },
//   ];

//   for (const s of schedule) {
//     await prisma.operatingHour.upsert({
//       where: {
//         businessId_dayOfWeek: { businessId: business1.id, dayOfWeek: s.day },
//       },
//       update: {},
//       create: {
//         businessId: business1.id,
//         dayOfWeek: s.day,
//         openTime: s.open ?? undefined,
//         closeTime: s.close ?? undefined,
//       },
//     });
//   }

//   console.log('✅ Operating hours created');

//   // =====================================================================
//   // 15. BUSINESS SERVICES (catalog matrix)
//   // =====================================================================

//   const bs1ExteriorWash = await prisma.businessService.upsert({
//     where: {
//       businessId_serviceId: {
//         businessId: business1.id,
//         serviceId: svcExteriorWash.id,
//       },
//     },
//     update: {},
//     create: {
//       businessId: business1.id,
//       serviceId: svcExteriorWash.id,
//       price: 15000n, // 150.00 EGP in piastres
//       averageDuration: 30,
//       isActive: true,
//     },
//   });

//   const bs1FullDetail = await prisma.businessService.upsert({
//     where: {
//       businessId_serviceId: {
//         businessId: business1.id,
//         serviceId: svcFullDetail.id,
//       },
//     },
//     update: {},
//     create: {
//       businessId: business1.id,
//       serviceId: svcFullDetail.id,
//       price: 45000n,
//       averageDuration: 120,
//       isActive: true,
//     },
//   });

//   const bs1EngineDiagnosis = await prisma.businessService.upsert({
//     where: {
//       businessId_serviceId: {
//         businessId: business1.id,
//         serviceId: svcEngineDiagnosis.id,
//       },
//     },
//     update: {},
//     create: {
//       businessId: business1.id,
//       serviceId: svcEngineDiagnosis.id,
//       price: 20000n,
//       averageDuration: 60,
//       isActive: true,
//     },
//   });

//   const bs1OilChange = await prisma.businessService.upsert({
//     where: {
//       businessId_serviceId: {
//         businessId: business1.id,
//         serviceId: svcOilChange.id,
//       },
//     },
//     update: {},
//     create: {
//       businessId: business1.id,
//       serviceId: svcOilChange.id,
//       price: 25000n,
//       averageDuration: 45,
//       isActive: true,
//     },
//   });

//   await prisma.businessService.upsert({
//     where: {
//       businessId_serviceId: {
//         businessId: business2.id,
//         serviceId: svcQuickWash.id,
//       },
//     },
//     update: {},
//     create: {
//       businessId: business2.id,
//       serviceId: svcQuickWash.id,
//       price: 8000n,
//       averageDuration: 20,
//       isActive: true,
//     },
//   });

//   console.log('✅ Business services (catalog) created');

//   // =====================================================================
//   // 16. IMAGES  (polymorphic — covers old gallery + avatar patterns)
//   // =====================================================================

//   // Business 1 gallery
//   for (let i = 1; i <= 3; i++) {
//     await prisma.image.create({
//       data: {
//         url: `https://cdn.glowfix.io/gallery/business1/photo${i}.jpg`,
//         storageKey: `gallery/business1/photo${i}.jpg`,
//         entityType: 'BUSINESS_GALLERY',
//         entityId: business1.id,
//       },
//     });
//   }

//   // Booking problem photo (replaces old bookingPhoto model)
//   // We'll attach it to booking3 after bookings are created — saved as a
//   // forward reference; insert happens at the end of the booking section.

//   console.log('✅ Images created');

//   // =====================================================================
//   // 17. LOYALTY CONFIG
//   // =====================================================================

//   await prisma.loyaltyConfig.create({
//     data: {
//       pointsPer100Egp: 10,
//       egpPerPoint: 0.5,
//       maxRedeemPct: 20,
//       isActive: true,
//     },
//   });

//   console.log('✅ Loyalty config created');

//   // =====================================================================
//   // 18. BOOKINGS
//   // Financial fields are in piastres. Commission is 10% of subTotal.
//   // =====================================================================

//   // Booking 1 — COMPLETED wash booking
//   const booking1 = await prisma.booking.create({
//     data: {
//       vehicleId: vehicle1.id,
//       businessId: business1.id,
//       scheduledAt: pastDate(7),
//       expectedDeliveryAt: pastDate(7),
//       subTotal: 15000n,
//       discount: 0n,
//       commission: 1500n,
//       totalPrice: 15000n,
//     },
//   });

//   // Booking 2 — CONFIRMED upcoming wash (loyalty discount applied)
//   const booking2 = await prisma.booking.create({
//     data: {
//       vehicleId: vehicle2.id,
//       businessId: business1.id,
//       scheduledAt: futureDate(2),
//       subTotal: 45000n,
//       discount: 2250n, // 5% loyalty discount
//       commission: 4500n,
//       totalPrice: 42750n,
//     },
//   });

//   // Booking 3 — PENDING (just placed)
//   const booking3 = await prisma.booking.create({
//     data: {
//       vehicleId: vehicle3.id,
//       businessId: business1.id,
//       scheduledAt: futureDate(5),
//       subTotal: 20000n,
//       discount: 0n,
//       commission: 2000n,
//       totalPrice: 20000n,
//     },
//   });

//   // Booking 4 — CANCELLED
//   const booking4 = await prisma.booking.create({
//     data: {
//       vehicleId: vehicle3.id,
//       businessId: business2.id,
//       scheduledAt: pastDate(3),
//       subTotal: 8000n,
//       discount: 0n,
//       commission: 800n,
//       totalPrice: 8000n,
//     },
//   });

//   console.log('✅ Bookings created');

//   // =====================================================================
//   // 19. BOOKING STATUS HISTORY
//   // =====================================================================

//   // Booking 1 — full lifecycle
//   await prisma.bookingStatus.createMany({
//     data: [
//       {
//         bookingId: booking1.id,
//         statusId: statusMap['PENDING'],
//         createdAt: pastDate(8),
//       },
//       {
//         bookingId: booking1.id,
//         statusId: statusMap['CONFIRMED'],
//         createdAt: pastDate(8),
//       },
//       {
//         bookingId: booking1.id,
//         statusId: statusMap['VEHICLE_RECEIVED'],
//         createdAt: pastDate(7),
//       },
//       {
//         bookingId: booking1.id,
//         statusId: statusMap['IN_PROGRESS'],
//         createdAt: pastDate(7),
//       },
//       {
//         bookingId: booking1.id,
//         statusId: statusMap['READY_FOR_PICKUP'],
//         createdAt: pastDate(7),
//       },
//       {
//         bookingId: booking1.id,
//         statusId: statusMap['COMPLETED'],
//         createdAt: pastDate(7),
//       },
//     ],
//   });

//   // Booking 2 — confirmed
//   await prisma.bookingStatus.createMany({
//     data: [
//       {
//         bookingId: booking2.id,
//         statusId: statusMap['PENDING'],
//         createdAt: pastDate(2),
//       },
//       {
//         bookingId: booking2.id,
//         statusId: statusMap['CONFIRMED'],
//         createdAt: pastDate(1),
//       },
//     ],
//   });

//   // Booking 3 — pending
//   await prisma.bookingStatus.create({
//     data: { bookingId: booking3.id, statusId: statusMap['PENDING'] },
//   });

//   // Booking 4 — cancelled
//   await prisma.bookingStatus.createMany({
//     data: [
//       {
//         bookingId: booking4.id,
//         statusId: statusMap['PENDING'],
//         createdAt: pastDate(4),
//       },
//       {
//         bookingId: booking4.id,
//         statusId: statusMap['CANCELLED'],
//         createdAt: pastDate(3),
//       },
//     ],
//   });

//   console.log('✅ Booking status history created');

//   // =====================================================================
//   // 20. BOOKING ITEMS  (price snapshot at booking time)
//   // =====================================================================

//   await prisma.bookingItem.create({
//     data: {
//       bookingId: booking1.id,
//       businessServiceId: bs1ExteriorWash.id,
//       price: 15000n,
//     },
//   });

//   await prisma.bookingItem.create({
//     data: {
//       bookingId: booking2.id,
//       businessServiceId: bs1FullDetail.id,
//       price: 45000n,
//     },
//   });

//   await prisma.bookingItem.create({
//     data: {
//       bookingId: booking3.id,
//       businessServiceId: bs1EngineDiagnosis.id,
//       price: 20000n,
//     },
//   });

//   await prisma.bookingItem.create({
//     data: {
//       bookingId: booking4.id,
//       businessServiceId: bs1OilChange.id,
//       price: 25000n,
//     },
//   });

//   console.log('✅ Booking items created');

//   // =====================================================================
//   // 21. BOOKING NOTES
//   // =====================================================================

//   await prisma.bookingNote.create({
//     data: {
//       bookingId: booking2.id,
//       body: 'Client requested tyre check as well.',
//     },
//   });

//   console.log('✅ Booking notes created');

//   // =====================================================================
//   // 22. BOOKING CANCELLATION  (booking4)
//   // =====================================================================

//   await prisma.bookingCancellation.create({
//     data: {
//       bookingId: booking4.id,
//       cancelledBy: client2User.id,
//       cancelledAt: pastDate(3),
//       reason: 'Change of plans.',
//     },
//   });

//   console.log('✅ Booking cancellation created');

//   // =====================================================================
//   // 23. BOOKING PROBLEM PHOTO  (via polymorphic Image — booking3)
//   // =====================================================================

//   await prisma.image.create({
//     data: {
//       url: 'https://cdn.glowfix.io/bookings/gf-0003/scratch.jpg',
//       storageKey: 'bookings/gf-0003/scratch.jpg',
//       entityType: 'BOOKING_PROBLEM',
//       entityId: booking3.id,
//     },
//   });

//   console.log('✅ Booking problem photo created');

//   // =====================================================================
//   // 24. PAYMENT  (for completed booking1)
//   // =====================================================================

//   const payment1 = await prisma.payment.upsert({
//     where: {
//       idempotencyKey: 'idem-gf-0001-payment',
//     },
//     update: {},
//     create: {
//       bookingId: booking1.id,
//       paymentMethodId: pmMap['CREDIT_CARD'],
//       provider: 'stripe',
//       providerRef: 'pi_seed_001',
//       amount: 15000n,
//       currency: 'EGP',
//       statusId: statusMap['PAID'],
//       idempotencyKey: 'idem-gf-0001-payment',
//     },
//   });

//   // =====================================================================
//   // 25. PAYOUT  (for business1, covering booking1)
//   // =====================================================================

//   const payout1 = await prisma.payout.create({
//     data: {
//       businessId: business1.id,
//       amount: 13500n, // 15000 − 1500 (10% commission)
//       statusId: statusMap['PAYOUT_PROCESSED'],
//       processedAt: pastDate(6),
//     },
//   });

//   await prisma.payoutBooking.create({
//     data: {
//       payoutId: payout1.id,
//       bookingId: booking1.id,
//     },
//   });

//   console.log('✅ Payout + payout booking created');

//   // =====================================================================
//   // 26. DIAGNOSTIC REPORT  (for booking3)
//   // =====================================================================

//   const report = await prisma.diagnosticReport.create({
//     data: {
//       bookingId: booking3.id,
//       summary: 'Vehicle shows minor oil leak and worn brake pads.',
//       validUntil: futureDate(7),
//       estimatedDuration: 240,
//     },
//   });

//   const finding1 = await prisma.reportFinding.create({
//     data: {
//       reportId: report.id,
//       title: 'Oil Leak — Rear Main Seal',
//       description: 'Minor seepage visible around the rear main seal.',
//       priority: 'WARNING',
//     },
//   });

//   const finding2 = await prisma.reportFinding.create({
//     data: {
//       reportId: report.id,
//       title: 'Brake Pads — Front Axle',
//       description:
//         'Front brake pads at 15% thickness. Replacement recommended soon.',
//       priority: 'CRITICAL',
//     },
//   });

//   const repair1 = await prisma.recommendedRepair.create({
//     data: {
//       reportId: report.id,
//       businessServiceId: bs1OilChange.id, // closest match in new schema
//     },
//   });

//   const repair2 = await prisma.recommendedRepair.create({
//     data: {
//       reportId: report.id,
//       businessServiceId: bs1EngineDiagnosis.id,
//     },
//   });

//   console.log(
//     `✅ Diagnostic report + ${[finding1, finding2].length} findings + ${[repair1, repair2].length} repairs created`,
//   );

//   // =====================================================================
//   // 27. REVIEW  (for completed booking1)
//   // =====================================================================

//   await prisma.review.create({
//     data: {
//       bookingId: booking1.id,
//       rating: 5,
//       qualityRating: 5,
//       punctualityRating: 4,
//       communicationRating: 5,
//       comment:
//         'Excellent service! Car looks brand new. Highly recommend GlowFix Maadi.',
//     },
//   });

//   console.log('✅ Review created');

//   // =====================================================================
//   // 28. LOYALTY TRANSACTIONS
//   // =====================================================================

//   await prisma.loyaltyTransaction.create({
//     data: {
//       clientId: client1.id,
//       bookingId: booking1.id,
//       type: 'EARNED',
//       points: 15, // 150 EGP × (10 pts / 100 EGP) = 15 pts
//       reason: 'Points earned on booking GF-0001 completion.',
//     },
//   });

//   await prisma.loyaltyTransaction.create({
//     data: {
//       clientId: client1.id,
//       bookingId: booking2.id,
//       type: 'REDEEMED',
//       points: -5, // negative — redeemed
//       reason: 'Points redeemed as discount on booking GF-0002.',
//     },
//   });

//   console.log('✅ Loyalty transactions created');

//   // =====================================================================
//   // 29. NOTIFICATIONS
//   // =====================================================================

//   await prisma.notification.createMany({
//     data: [
//       {
//         recipientUserId: clientUser.id,
//         actorUserId: null,
//         typeId: ntMap['BOOKING_CONFIRMED'],
//         title: 'Booking Confirmed',
//         body: 'Your booking GF-0002 has been confirmed for the Full Detail Package.',
//         actionUrl: '/bookings/GF-0002',
//         sentAt: new Date(),
//       },
//       {
//         recipientUserId: clientUser.id,
//         actorUserId: null,
//         typeId: ntMap['BOOKING_COMPLETED'],
//         title: 'Booking Completed',
//         body: 'Your vehicle is ready for pickup. Booking GF-0001 is completed.',
//         actionUrl: '/bookings/GF-0001',
//         sentAt: new Date(),
//       },
//       {
//         recipientUserId: managerUser.id,
//         actorUserId: clientUser.id,
//         typeId: ntMap['BOOKING_REQUESTED'],
//         title: 'New Booking Request',
//         body: 'Omar Nasser requested a Full Detail Package for 2 days from now.',
//         actionUrl: '/dashboard/bookings',
//         sentAt: new Date(),
//       },
//       {
//         recipientUserId: managerUser.id,
//         actorUserId: clientUser.id,
//         typeId: ntMap['NEW_REVIEW'],
//         title: 'New Review Received',
//         body: 'You received a 5-star review from Omar Nasser.',
//         actionUrl: '/dashboard/reviews',
//         sentAt: new Date(),
//       },
//     ],
//   });

//   console.log('✅ Notifications created');

//   // =====================================================================
//   // 30. CONVERSATION + PARTICIPANTS + MESSAGES  (for booking2)
//   // =====================================================================

//   const conversation = await prisma.conversation.create({
//     data: {
//       bookingId: booking2.id,
//       type: 'BOOKING',
//       statusId: statusMap['OPEN'],
//     },
//   });

//   await prisma.conversationParticipant.createMany({
//     data: [
//       {
//         conversationId: conversation.id,
//         userId: clientUser.id,
//         role: 'CLIENT',
//       },
//       {
//         conversationId: conversation.id,
//         userId: managerUser.id,
//         role: 'MANAGER',
//       },
//     ],
//   });

//   const sysMsg = await prisma.message.create({
//     data: {
//       conversationId: conversation.id,
//       senderUserId: null,
//       senderRole: 'SYSTEM',
//       type: 'TEXT',
//       body: 'Booking GF-0002 has been confirmed. You can now chat with the workshop.',
//       statusId: statusMap['SENT'],
//     },
//   });

//   const clientMsg = await prisma.message.create({
//     data: {
//       conversationId: conversation.id,
//       senderUserId: clientUser.id,
//       senderRole: 'CLIENT',
//       type: 'TEXT',
//       body: 'Hi, please also check the air filters while the car is in.',
//       statusId: statusMap['SENT'],
//     },
//   });

//   await prisma.message.create({
//     data: {
//       conversationId: conversation.id,
//       senderUserId: managerUser.id,
//       senderRole: 'MANAGER',
//       type: 'TEXT',
//       body: 'Sure, we will inspect the air filters and let you know!',
//       statusId: statusMap['DELIVERED'],
//       deliveredAt: new Date(),
//     },
//   });

//   // Chat attachment stored via polymorphic Image (replaces old MessageAttachment model)
//   await prisma.image.create({
//     data: {
//       url: 'https://cdn.glowfix.io/messages/airfilter_ref.jpg',
//       storageKey: 'messages/airfilter_ref.jpg',
//       entityType: 'CHAT_ATTACHMENT',
//       entityId: clientMsg.id,
//     },
//   });

//   console.log(
//     `✅ Conversation + ${[sysMsg, clientMsg].length + 1} messages + 1 attachment created`,
//   );

//   // =====================================================================
//   // 31. AUDIT LOGS
//   // =====================================================================

//   await prisma.auditLog.createMany({
//     data: [
//       {
//         actorId: adminUser.id,
//         entityType: 'BUSINESS',
//         entityId: business1.id,
//         action: 'APPROVED',
//         newData: { status: 'APPROVED' },
//         ipAddress: '197.60.1.1',
//         userAgent: 'Mozilla/5.0',
//       },
//       {
//         actorId: clientUser.id,
//         entityType: 'BOOKING',
//         entityId: booking1.id,
//         action: 'CREATED',
//         newData: { status: 'PENDING' },
//         ipAddress: '41.33.100.5',
//       },
//       {
//         actorId: null, // system action
//         entityType: 'BOOKING',
//         entityId: booking1.id,
//         action: 'STATUS_CHANGED',
//         oldData: { status: 'READY_FOR_PICKUP' },
//         newData: { status: 'COMPLETED' },
//       },
//       {
//         actorId: adminUser.id,
//         entityType: 'PAYMENT',
//         entityId: payment1.id,
//         action: 'CREATED',
//         newData: { amount: 15000, currency: 'EGP', status: 'PAID' },
//         ipAddress: '197.60.1.1',
//       },
//     ],
//   });

//   console.log('✅ Audit logs created');

//   // =====================================================================
//   // 32. OTP (unused — for demo/testing)
//   // =====================================================================

//   await prisma.userOtp.create({
//     data: {
//       userId: client2User.id,
//       purpose: 'EMAIL_VERIFICATION',
//       codeHash: hashSha256('123456'),
//       expiresAt: futureDate(1),
//       attempts: 0,
//     },
//   });

//   console.log('✅ OTP record created');

//   // =====================================================================
//   // Done
//   // =====================================================================

//   console.log('\n🎉 Glowfix seed completed successfully!');
// }

// // -----------------------------------------------------------------------
// // Entry point
// // -----------------------------------------------------------------------

// main()
//   .catch((e) => {
//     console.error('❌ Seed failed:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
