const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
console.log('Connecting...');
p.$connect()
  .then(() => { console.log('Connected!'); return p.$disconnect(); })
  .then(() => console.log('Disconnected'))
  .catch(e => console.error('Error:', e.message));
