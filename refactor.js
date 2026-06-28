const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');

const project = new Project();
const sourceFile = project.addSourceFileAtPath('server/src/modules/admin/admin.service.ts');

const serviceClass = sourceFile.getClass('AdminService');
const methods = serviceClass.getMethods();

let repoContent = `import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { IAdminRepository } from './interfaces/admin-repository.interface';
import * as bcrypt from 'bcrypt';
import { DashboardStatsDto, RevenueStatsDto, TopPerformersDto, PlatformHealthDto } from './dto/admin-stats.dto';
import { GetUsersAdminDto, CreateUserAdminDto, UpdateUserAdminDto, UserResponseAdminDto, UserRole } from './dto/admin-users.dto';
import { GetBusinessesAdminDto, ApproveBusinessDto, RejectBusinessDto, BusinessResponseAdminDto, BusinessStatus } from './dto/admin-businesses.dto';
import { UpdateSystemSettingsDto, SystemSettingsResponseDto } from './dto/admin-settings.dto';
import { GetPayoutsAdminDto, ProcessPayoutDto, PayoutStatus } from './dto/admin-payouts.dto';

@Injectable()
export class AdminRepository implements IAdminRepository {
  private readonly logger = new Logger(AdminRepository.name);
  private readonly SALT_ROUNDS = 12;

  constructor(private readonly prisma: PrismaService) {}

`;

methods.forEach(m => {
  const isPrivate = m.getModifiers().some(mod => mod.getKind() === SyntaxKind.PrivateKeyword);
  if (isPrivate || m.getName() === 'constructor') return;
  
  repoContent += '  ' + m.getText() + '\n\n';
});

repoContent += '}\n';

fs.writeFileSync('server/src/modules/admin/admin.repository.ts', repoContent);
