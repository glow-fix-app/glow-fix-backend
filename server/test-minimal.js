// Simulate what NestJS does during startup with Prisma
const { PrismaClient } = require('@prisma/client');
const { Logger } = require('@nestjs/common');

class TestPrismaService extends PrismaClient {
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });
    this.logger = new Logger('TestPrisma');
  }

  async onModuleInit() {
    this.$on('query', (event) => {
      if (event.duration > 200) {
        console.log(`Slow query: ${event.query}`);
      }
    });
    this.$on('error', (event) => {
      console.error(`DB error: ${event.message}`);
    });
    this.$on('warn', (event) => {
      console.warn(`DB warn: ${event.message}`);
    });

    console.log('Before $connect()');
    await this.$connect();
    console.log('After $connect() - connected!');
  }
}

const svc = new TestPrismaService();
svc.onModuleInit()
  .then(() => {
    console.log('SUCCESS: Prisma connected via lifecycle');
    return svc.$disconnect();
  })
  .then(() => console.log('Disconnected'))
  .catch(e => console.error('FAILED:', e.message));
