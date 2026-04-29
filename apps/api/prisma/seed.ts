import  {PrismaClient}  from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PASSWORD } from '@glow-fix/utils';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting database seed...');

  // ─── Create Super Admin ───
  const adminPasswordHash = await bcrypt.hash('Admin@123!', PASSWORD.BCRYPT_COST_FACTOR);

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@glowfix.com' },
    update: {},
    create: {
      email: 'admin@glowfix.com',
      fullName: 'System Administrator',
      passwordHash: adminPasswordHash,
      role: 'SUPER_ADMIN',
      permissions: ['*'],
      twoFactorEnabled: false, // disable for dev seed
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // ─── Create Car Wash Locations ───
  const carWash1 = await prisma.carWash.upsert({
    where: { id: '00000000-0000-4000-8000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000001',
      name: 'Glow Fix Downtown',
      address: '123 Main Street, New York, NY 10001',
      latitude: 40.7484,
      longitude: -73.9967,
      phone: '+12125551234',
      email: 'downtown@glowfix.com',
      description: 'Our flagship location in the heart of Manhattan.',
      photos: [],
      isActive: true,
    },
  });

  const carWash2 = await prisma.carWash.upsert({
    where: { id: '00000000-0000-4000-8000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-4000-8000-000000000002',
      name: 'Glow Fix Brooklyn',
      address: '456 Atlantic Ave, Brooklyn, NY 11217',
      latitude: 40.6862,
      longitude: -73.9777,
      phone: '+17185551234',
      email: 'brooklyn@glowfix.com',
      description: 'Premium car care in Brooklyn.',
      photos: [],
      isActive: true,
    },
  });
  console.log(`✅ Car washes created: ${carWash1.name}, ${carWash2.name}`);

  // ─── Create Operating Hours ───
  const days = [0, 1, 2, 3, 4, 5, 6]; // Sun-Sat
  for (const carWashId of [carWash1.id, carWash2.id]) {
    for (const day of days) {
      await prisma.operatingHours.upsert({
        where: {
          carWashId_dayOfWeek: { carWashId, dayOfWeek: day },
        },
        update: {},
        create: {
          carWashId,
          dayOfWeek: day,
          openTime: day === 0 ? '10:00' : '08:00',
          closeTime: day === 0 ? '16:00' : '20:00',
          isClosed: false,
        },
      });
    }
  }
  console.log('✅ Operating hours created');

  // ─── Create Services ───
  const serviceDefinitions = [
    {
      name: 'Exterior Wash',
      type: 'WASH',
      description: 'Complete exterior hand wash with premium soap and rinse.',
      durationMinutes: 30,
      basePrice: 2499,
      peakPrice: 2999,
    },
    {
      name: 'Interior + Exterior Wash',
      type: 'WASH',
      description: 'Full interior vacuum and wipe-down plus exterior hand wash.',
      durationMinutes: 60,
      basePrice: 4999,
      peakPrice: 5999,
    },
    {
      name: 'Hand Polish',
      type: 'POLISH',
      description: 'Professional hand polish to restore paint shine and clarity.',
      durationMinutes: 90,
      basePrice: 7999,
      peakPrice: 9499,
    },
    {
      name: 'Full Detailing',
      type: 'DETAILING',
      description: 'Comprehensive interior and exterior detailing, clay bar, and sealant.',
      durationMinutes: 180,
      basePrice: 14999,
      peakPrice: 17999,
    },
    {
      name: 'Complete Care Package',
      type: 'COMBO',
      description: 'Wash + Polish + Interior Detail — the ultimate car care experience.',
      durationMinutes: 240,
      basePrice: 19999,
      peakPrice: 23999,
    },
  ];

  for (const carWashId of [carWash1.id, carWash2.id]) {
    for (let i = 0; i < serviceDefinitions.length; i++) {
      const def = serviceDefinitions[i];
      await prisma.service.create({
        data: {
          carWashId,
          name: def.name,
          description: def.description,
          type: def.type,
          durationMinutes: def.durationMinutes,
          basePrice: def.basePrice,
          peakPrice: def.peakPrice,
          isActive: true,
          sortOrder: i,
        },
      });
    }
  }
  console.log('✅ Services created');

  // ─── Create Add-Ons ───
  const addOnDefinitions = [
    { name: 'Premium Wax Coating', price: 1999, durationMinutes: 20 },
    { name: 'Interior Shampoo', price: 2999, durationMinutes: 30 },
    { name: 'Engine Bay Cleaning', price: 3499, durationMinutes: 25 },
    { name: 'Headlight Restoration', price: 2499, durationMinutes: 20 },
    { name: 'Tire Shine', price: 999, durationMinutes: 10 },
    { name: 'Air Freshener', price: 499, durationMinutes: 5 },
    { name: 'Ceramic Spray Coating', price: 4999, durationMinutes: 30 },
  ];

  for (const carWashId of [carWash1.id, carWash2.id]) {
    for (const def of addOnDefinitions) {
      await prisma.addOn.create({
        data: {
          carWashId,
          name: def.name,
          description: `Add ${def.name.toLowerCase()} to your service.`,
          price: def.price,
          durationMinutes: def.durationMinutes,
          isActive: true,
        },
      });
    }
  }
  console.log('✅ Add-ons created');

  // ─── Create Staff ───
  const staffPasswordHash = await bcrypt.hash('Staff@123!', PASSWORD.BCRYPT_COST_FACTOR);

  const staffDefinitions = [
    {
      fullName: 'James Wilson',
      mobileNumber: '+12125559001',
      email: 'james@glowfix.com',
      licenseNumber: 'TECH-001',
      specialties: ['WASH', 'POLISH'],
      hourlyRate: 2500,
    },
    {
      fullName: 'Maria Garcia',
      mobileNumber: '+12125559002',
      email: 'maria@glowfix.com',
      licenseNumber: 'TECH-002',
      specialties: ['WASH', 'DETAILING'],
      hourlyRate: 2800,
    },
    {
      fullName: 'David Chen',
      mobileNumber: '+12125559003',
      email: 'david@glowfix.com',
      licenseNumber: 'TECH-003',
      specialties: ['WASH', 'POLISH', 'DETAILING'],
      hourlyRate: 3200,
    },
  ];

  for (const def of staffDefinitions) {
    await prisma.staff.upsert({
      where: { email: def.email },
      update: {},
      create: {
        ...def,
        passwordHash: staffPasswordHash,
        mustChangePassword: false, // for dev convenience
      },
    });
  }
  console.log('✅ Staff created');

  // ─── Create Notification Templates ───
  const templates = [
    {
      name: 'booking-confirmation',
      type: 'BOOKING_CONFIRMATION',
      channels: ['EMAIL', 'WHATSAPP', 'PUSH'],
      subject: 'Your car wash is booked! 🚗',
      body: 'Hi {{customerName}}, your {{serviceType}} service is confirmed for {{scheduledTime}}. Location: {{carWashName}}. Queue Position: #{{queuePosition}}. Track: {{bookingUrl}}',
      variables: ['customerName', 'serviceType', 'scheduledTime', 'carWashName', 'queuePosition', 'bookingUrl'],
    },
    {
      name: 'booking-reminder',
      type: 'BOOKING_REMINDER',
      channels: ['PUSH', 'WHATSAPP'],
      subject: 'Reminder: Car wash in 1 hour ⏰',
      body: 'Hi {{customerName}}, your {{serviceType}} at {{carWashName}} is in 1 hour. See you soon!',
      variables: ['customerName', 'serviceType', 'carWashName'],
    },
    {
      name: 'status-update',
      type: 'STATUS_UPDATE',
      channels: ['PUSH', 'IN_APP'],
      subject: 'Service Update 🔄',
      body: 'Your vehicle {{vehicleName}} is now: {{status}}. {{additionalInfo}}',
      variables: ['vehicleName', 'status', 'additionalInfo'],
    },
    {
      name: 'service-completed',
      type: 'STATUS_UPDATE',
      channels: ['EMAIL', 'WHATSAPP', 'PUSH'],
      subject: 'Your car is ready! ✨',
      body: 'Hi {{customerName}}, your {{serviceType}} is complete! Your {{vehicleName}} is sparkling clean. Pick it up at {{carWashName}}. Leave a review: {{reviewUrl}}',
      variables: ['customerName', 'serviceType', 'vehicleName', 'carWashName', 'reviewUrl'],
    },
    {
      name: 'welcome',
      type: 'WELCOME',
      channels: ['EMAIL'],
      subject: 'Welcome to Glow Fix! 🎉',
      body: 'Hi {{customerName}}, welcome to Glow Fix! Use your referral code {{referralCode}} to earn bonus points. Book your first wash: {{bookingUrl}}',
      variables: ['customerName', 'referralCode', 'bookingUrl'],
    },
    {
      name: 'payment-receipt',
      type: 'PAYMENT_RECEIPT',
      channels: ['EMAIL'],
      subject: 'Payment Receipt - Glow Fix',
      body: 'Hi {{customerName}}, payment of {{amount}} received for {{serviceType}} on {{date}}. Transaction ID: {{transactionId}}.',
      variables: ['customerName', 'amount', 'serviceType', 'date', 'transactionId'],
    },
    {
      name: 'review-request',
      type: 'REVIEW_REQUEST',
      channels: ['EMAIL', 'PUSH'],
      subject: 'How was your wash? ⭐',
      body: 'Hi {{customerName}}, how was your {{serviceType}} experience? Leave a review and earn {{bonusPoints}} loyalty points! {{reviewUrl}}',
      variables: ['customerName', 'serviceType', 'bonusPoints', 'reviewUrl'],
    },
  ];

  for (const tmpl of templates) {
    await prisma.notificationTemplate.upsert({
      where: { name: tmpl.name },
      update: {},
      create: tmpl,
    });
  }
  console.log('✅ Notification templates created');

  // ─── Create Product Categories ───
  const categories = [
    { name: 'Car Shampoos', slug: 'car-shampoos', description: 'Premium car wash shampoos and soaps' },
    { name: 'Waxes & Sealants', slug: 'waxes-sealants', description: 'Paint protection and shine products' },
    { name: 'Interior Care', slug: 'interior-care', description: 'Interior cleaning and conditioning' },
    { name: 'Accessories', slug: 'accessories', description: 'Microfiber cloths, brushes, and more' },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.productCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, isActive: true },
    });
    createdCategories[cat.slug] = created.id;
  }
  console.log('✅ Product categories created');

  // ─── Create Products ───
  const products = [
    {
      name: 'GlowMax Premium Shampoo',
      slug: 'glowmax-premium-shampoo',
      description: 'Ultra-concentrated car wash shampoo with ceramic coating protection.',
      price: 1999,
      compareAtPrice: 2499,
      stock: 100,
      categorySlug: 'car-shampoos',
      isFeatured: true,
      sku: 'GF-SHAMP-001',
    },
    {
      name: 'Crystal Shield Wax',
      slug: 'crystal-shield-wax',
      description: 'Long-lasting carnauba wax for ultimate paint protection.',
      price: 3499,
      stock: 50,
      categorySlug: 'waxes-sealants',
      isFeatured: true,
      sku: 'GF-WAX-001',
    },
    {
      name: 'Interior Leather Conditioner',
      slug: 'interior-leather-conditioner',
      description: 'Premium leather conditioner to keep seats soft and protected.',
      price: 2499,
      stock: 75,
      categorySlug: 'interior-care',
      isFeatured: false,
      sku: 'GF-INT-001',
    },
    {
      name: 'Microfiber Towel 6-Pack',
      slug: 'microfiber-towel-6-pack',
      description: 'Ultra-soft 400 GSM microfiber towels for streak-free drying.',
      price: 1499,
      stock: 200,
      categorySlug: 'accessories',
      isFeatured: false,
      sku: 'GF-ACC-001',
    },
  ];

  for (const prod of products) {
    const { categorySlug, ...productData } = prod;
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        categoryId: createdCategories[categorySlug],
        images: [],
        isActive: true,
        lowStockThreshold: 5,
      },
    });
  }
  console.log('✅ Products created');

  // ─── Create FAQs ───
  const faqs = [
    { category: 'General', question: 'What are your operating hours?', answer: 'We are open Monday to Saturday from 8:00 AM to 8:00 PM, and Sundays from 10:00 AM to 4:00 PM.' },
    { category: 'General', question: 'Do I need an appointment?', answer: 'Walk-ins are welcome, but we recommend booking online for the shortest wait times.' },
    { category: 'Services', question: 'How long does a full detailing take?', answer: 'A full detailing service typically takes 3-4 hours depending on vehicle size and condition.' },
    { category: 'Services', question: 'Do you offer pick-up and drop-off?', answer: 'Yes! Our Ultimate subscription plan includes free pick-up and drop-off service.' },
    { category: 'Payment', question: 'What payment methods do you accept?', answer: 'We accept all major credit/debit cards, PayPal, cash, and loyalty points.' },
    { category: 'Loyalty', question: 'How do loyalty points work?', answer: 'Earn 10 points per \$1 spent. Redeem 100 points for a \$5 discount. Double points during off-peak hours (2-5 PM).' },
    { category: 'Warranty', question: 'Do services come with a warranty?', answer: 'Yes, all detailing services include a 7-day warranty against defects in workmanship.' },
  ];

  for (let i = 0; i < faqs.length; i++) {
    await prisma.faq.create({
      data: { ...faqs[i], sortOrder: i, isActive: true },
    });
  }
  console.log('✅ FAQs created');

  // ─── Create System Configs ───
  const configs = [
    { key: 'loyalty.points_per_dollar', value: { amount: 10 }, description: 'Points earned per dollar spent' },
    { key: 'loyalty.redemption_rate', value: { pointsPerDollar: 20 }, description: '20 points = \$1 discount' },
    { key: 'loyalty.review_bonus', value: { points: 50 }, description: 'Bonus points for leaving a review' },
    { key: 'loyalty.off_peak_multiplier', value: { multiplier: 2, startHour: 14, endHour: 17 }, description: 'Off-peak hours double points' },
    { key: 'loyalty.expiry_months', value: { months: 6 }, description: 'Points expire after months of inactivity' },
    { key: 'booking.cancellation_deadline_hours', value: { hours: 2 }, description: 'Hours before booking when cancellation is allowed' },
    { key: 'booking.no_show_grace_minutes', value: { minutes: 30 }, description: 'Grace period before marking no-show' },
    { key: 'referral.referrer_points', value: { points: 500 }, description: 'Points awarded to referrer' },
    { key: 'referral.referee_points', value: { points: 300 }, description: 'Points awarded to new referred user' },
    { key: 'referral.attribution_days', value: { days: 30 }, description: 'Days for referral attribution window' },
  ];

  for (const config of configs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: {},
      create: { ...config, updatedBy: admin.id },
    });
  }
  console.log('✅ System configs created');

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });