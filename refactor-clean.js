const fs = require('fs');
const { Project } = require('ts-morph');

const project = new Project();
const sourceFile = project.addSourceFileAtPath('server/src/modules/admin/admin.service.ts');

const serviceClass = sourceFile.getClass('AdminService');

// Get the 4 methods
const dashboardMethod = serviceClass.getMethod('getDashboardStats');
const revenueMethod = serviceClass.getMethod('getRevenueStats');
const topPerformersMethod = serviceClass.getMethod('getTopPerformers');
const healthMethod = serviceClass.getMethod('getPlatformHealth');

// Helper method getWeekNumber is needed by revenue
const weekNumberMethod = serviceClass.getMethod('getWeekNumber');

let repoContent = `import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { DashboardStatsDto, RevenueStatsDto, TopPerformersDto, PlatformHealthDto } from './dto/admin-stats.dto';

@Injectable()
export class AdminRepository {
  private readonly logger = new Logger(AdminRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  get user() { return this.prisma.user; }
  get client() { return this.prisma.client; }
  get business() { return this.prisma.business; }
  get status() { return this.prisma.status; }
  get booking() { return this.prisma.booking; }
  get payment() { return this.prisma.payment; }
  get payout() { return this.prisma.payout; }
  get review() { return this.prisma.review; }
  get category() { return this.prisma.category; }
  get loyaltyTransaction() { return this.prisma.loyaltyTransaction; }
  get businessStatus() { return this.prisma.businessStatus; }
  get businessDocument() { return this.prisma.businessDocument; }
  get documentStatus() { return this.prisma.documentStatus; }
  
  $transaction(args: any) { return this.prisma.$transaction(args); }
  $queryRaw(strings: TemplateStringsArray, ...values: any[]) { return this.prisma.$queryRaw(strings, ...values); }

  ${dashboardMethod.getText()}
  ${revenueMethod.getText()}
  ${topPerformersMethod.getText()}
  ${healthMethod.getText()}
  
  ${weekNumberMethod.getText()}
}
`;

fs.writeFileSync('server/src/modules/admin/admin.repository.ts', repoContent);

// Now update AdminService
// 1. Update the bodies of the 4 methods
dashboardMethod.setBodyText('return this.repository.getDashboardStats();');
revenueMethod.setBodyText('return this.repository.getRevenueStats(period, months);');
topPerformersMethod.setBodyText('return this.repository.getTopPerformers(limit);');
healthMethod.setBodyText('return this.repository.getPlatformHealth();');

// 2. Remove getWeekNumber from Service
weekNumberMethod.remove();

// 3. Replace all remaining this.prisma with this.repository
const methodsToUpdate = serviceClass.getMethods().filter(m => 
  !['getDashboardStats', 'getRevenueStats', 'getTopPerformers', 'getPlatformHealth'].includes(m.getName())
);

methodsToUpdate.forEach(m => {
  let body = m.getBodyText();
  if (body) {
    body = body.replace(/this\.prisma/g, 'this.repository');
    m.setBodyText(body);
  }
});

// 4. Update imports and constructor
sourceFile.addImportDeclaration({
  namedImports: ['AdminRepository'],
  moduleSpecifier: './admin.repository'
});

const prismaImport = sourceFile.getImportDeclaration(decl => decl.getModuleSpecifierValue().includes('prisma.service'));
if (prismaImport) {
  prismaImport.remove();
}

const constructor = serviceClass.getConstructors()[0];
const prismaParam = constructor.getParameters().find(p => p.getName() === 'prisma');
if (prismaParam) {
  prismaParam.remove();
  constructor.insertParameter(0, {
    name: 'repository',
    isReadonly: true,
    scope: 'private',
    type: 'AdminRepository'
  });
}

sourceFile.saveSync();
