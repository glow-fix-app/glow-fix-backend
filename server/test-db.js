const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.$connect()
  .then(() => { console.log('DB CONNECTED'); return p.$disconnect(); })
  .catch(e => console.error('DB ERROR:', e.message));
