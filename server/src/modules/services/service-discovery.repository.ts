import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { IServiceDiscoveryRepository } from './interfaces/service-discovery-repository.interface';

@Injectable()
export class ServiceDiscoveryRepository implements IServiceDiscoveryRepository {
  constructor(private readonly prisma: PrismaService) {}

  get service() {
    return this.prisma.service;
  }

  get category() {
    return this.prisma.category;
  }

  get business() {
    return this.prisma.business;
  }

  get review() {
    return this.prisma.review;
  }

  get client() {
    return this.prisma.client;
  }

  get operatingHour() {
    return this.prisma.operatingHour;
  }

  get businessDocument() {
    return this.prisma.businessDocument;
  }

  get image() {
    return this.prisma.image;
  }

  async queryRaw<T = any>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Promise<T> {
    return this.prisma.$queryRaw<T>(query, ...values);
  }
}
