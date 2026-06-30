import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { IServiceRepository } from './interfaces/service-repository.interface';

@Injectable()
export class ServicesRepository implements IServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  get category() {
    return this.prisma.category;
  }

  get service() {
    return this.prisma.service;
  }

  get businessService() {
    return this.prisma.businessService;
  }

  get business() {
    return this.prisma.business;
  }

  get bookingItem() {
    return this.prisma.bookingItem;
  }

  async $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P]) {
    return this.prisma.$transaction(arg);
  }
}
