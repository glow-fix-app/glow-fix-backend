const fs = require('fs');

// 1. Refactor services.service.ts
let ss = fs.readFileSync('server/src/modules/services/services.service.ts', 'utf-8');

ss = ss.replace("import { PrismaService } from '../../core/prisma/prisma.service';", "import { ServicesRepository } from './services.repository';");
ss = ss.replace("private readonly prisma: PrismaService,", "private readonly repository: ServicesRepository,");
ss = ss.replace(/this\.prisma\./g, 'this.repository.');

fs.writeFileSync('server/src/modules/services/services.service.ts', ss);

// 2. Refactor service-discovery.service.ts
let sd = fs.readFileSync('server/src/modules/services/service-discovery.service.ts', 'utf-8');

sd = sd.replace("import { PrismaService } from '../../core/prisma/prisma.service';", "import { ServiceDiscoveryRepository } from './service-discovery.repository';");
sd = sd.replace("private readonly prisma: PrismaService", "private readonly repository: ServiceDiscoveryRepository");
sd = sd.replace(/this\.prisma\.\$queryRaw/g, 'this.repository.queryRaw');
sd = sd.replace(/this\.prisma\./g, 'this.repository.');

fs.writeFileSync('server/src/modules/services/service-discovery.service.ts', sd);
