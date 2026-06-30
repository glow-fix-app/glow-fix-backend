const fs = require('fs');
const { Project, SyntaxKind } = require('ts-morph');

const project = new Project();
const sourceFile = project.addSourceFileAtPath('server/src/modules/services/services.service.ts');
const serviceClass = sourceFile.getClass('ServicesService');

let repoContent = `import { Injectable, Logger, NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ServicesRepository {
  private readonly logger = new Logger(ServicesRepository.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

`;

const methods = serviceClass.getMethods();

methods.forEach(m => {
  const isPrivate = m.getModifiers().some(mod => mod.getKind() === SyntaxKind.PrivateKeyword);
  if (m.getName() === 'constructor') return;
  
  // Make everything public in the repository so the service can call it
  const methodCode = m.getText().replace(/private\s+/, 'public ').replace(/protected\s+/, 'public ');
  repoContent += '  ' + methodCode + '\n\n';
});

repoContent += '}\n';

fs.writeFileSync('server/src/modules/services/services.repository.ts', repoContent);

// Now refactor ServicesService
methods.forEach(m => {
  if (m.getName() === 'constructor') return;
  
  const params = m.getParameters().map(p => p.getName()).join(', ');
  m.setBodyText(`return this.repository.${m.getName()}(${params});`);
});

// Update imports
sourceFile.addImportDeclaration({
  namedImports: ['ServicesRepository'],
  moduleSpecifier: './services.repository'
});

const prismaImport = sourceFile.getImportDeclaration(decl => decl.getModuleSpecifierValue().includes('prisma.service'));
if (prismaImport) {
  prismaImport.remove();
}

const constructor = serviceClass.getConstructors()[0];
if (constructor) {
  const prismaParam = constructor.getParameters().find(p => p.getName() === 'prisma');
  if (prismaParam) {
    prismaParam.remove();
  }
  
  // Also remove eventEmitter from service since the repo is handling it?
  // Wait, if repo handles it, service doesn't need it. But let's leave it to avoid errors.
  
  constructor.insertParameter(0, {
    name: 'repository',
    isReadonly: true,
    scope: 'private',
    type: 'ServicesRepository'
  });
}

sourceFile.saveSync();
