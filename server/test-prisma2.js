const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' },
  ],
});
p.$on('query', (e) => console.log('Query:', e.query));
console.time('connect');
p.$connect()
  .then(() => {
    console.timeEnd('connect');
    console.log('Connected!');
    return p.$disconnect();
  })
  .catch((e) => console.error('Error:', e));
