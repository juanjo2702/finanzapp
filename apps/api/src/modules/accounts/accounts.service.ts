import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAccountDto, UpdateAccountDto } from '@finanzapp/shared-types';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { userId, isArchived: false },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
      include: {
        transactions: {
          take: 10,
          orderBy: { transactionDate: 'desc' },
          include: { category: true },
        },
      },
    });

    if (!account) {
      throw new NotFoundException('Cuenta no encontrada');
    }

    return account;
  }

  async create(userId: string, dto: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        userId,
        name: dto.name,
        type: dto.type as any,
        currency: dto.currency as any,
        balance: dto.initialBalance || 0,
        initialBalance: dto.initialBalance || 0,
        color: dto.color || '#2563eb',
        icon: dto.icon || 'wallet',
        institutionName: dto.institutionName,
        accountNumberMask: dto.accountNumberMask,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateAccountDto) {
    await this.findOne(userId, id);

    return this.prisma.account.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.type && { type: dto.type as any }),
        ...(dto.currency && { currency: dto.currency as any }),
        ...(dto.color && { color: dto.color }),
        ...(dto.icon && { icon: dto.icon }),
        ...(dto.institutionName !== undefined && { institutionName: dto.institutionName }),
        ...(dto.accountNumberMask !== undefined && { accountNumberMask: dto.accountNumberMask }),
      },
    });
  }

  async delete(userId: string, id: string) {
    await this.findOne(userId, id);
    // Soft-archive to preserve transaction history
    return this.prisma.account.update({
      where: { id },
      data: { isArchived: true },
    });
  }
}
