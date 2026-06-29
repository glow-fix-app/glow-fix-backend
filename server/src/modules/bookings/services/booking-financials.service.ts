import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';

@Injectable()
export class BookingFinancialsService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateFinancials(subTotal: number) {
    const setting = await this.prisma.setting.findFirst();
    const feePct = setting?.businessFeePct ? Number(setting.businessFeePct) : 10.0;
    const commission = (subTotal * feePct) / 100;
    const platformFee = setting?.clientPlatformFee ? Number(setting.clientPlatformFee) : 0;
    const totalPrice = subTotal + platformFee; // subtotal + platform fee minus discounts (initially 0)

    return {
      subTotal,
      commission,
      platformFee,
      totalPrice
    };
  }
}
