import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Currency } from '@finanzapp/shared-types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        baseCurrency: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: { accounts: true, transactions: true, budgets: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async updateBaseCurrency(userId: string, baseCurrency: Currency) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { baseCurrency: baseCurrency as any },
      select: { id: true, email: true, fullName: true, baseCurrency: true },
    });
  }
}
