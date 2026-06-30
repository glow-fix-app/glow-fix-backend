const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');

const project = new Project();
const sourceFile = project.addSourceFileAtPath('server/src/modules/admin/admin.service.ts');

const serviceClass = sourceFile.getClass('AdminService');
const methods = serviceClass.getMethods();

methods.forEach(m => {
  const isPrivate = m.getModifiers().some(mod => mod.getKind() === SyntaxKind.PrivateKeyword);
  if (isPrivate || m.getName() === 'constructor') return;
  
  const params = m.getParameters().map(p => p.getName()).join(', ');
  
  m.setBodyText(`return this.repository.${m.getName()}(${params});`);
});

// Update imports
sourceFile.addImportDeclaration({
  namedImports: ['AdminRepository'],
  moduleSpecifier: './admin.repository'
});

// Remove PrismaService import
const prismaImport = sourceFile.getImportDeclaration(decl => decl.getModuleSpecifierValue().includes('prisma.service'));
if (prismaImport) {
  prismaImport.remove();
}

// Update constructor
const constructor = serviceClass.getConstructors()[0];
if (constructor) {
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
}

sourceFile.saveSync();
