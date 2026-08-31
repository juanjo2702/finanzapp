import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from '@finanzapp/shared-types';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.category.findMany({
      where: {
        OR: [{ userId }, { isSystem: true }],
      },
      orderBy: [{ classification: 'asc' }, { name: 'asc' }],
    });
  }

  async create(userId: string, dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        userId,
        name: dto.name,
        icon: dto.icon || 'tag',
        color: dto.color || '#3b82f6',
        classification: dto.classification as any,
        parentId: dto.parentId,
        isSystem: false,
      },
    });
  }

  async delete(userId: string, id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId, isSystem: false },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada o es una categoría protegida del sistema');
    }

    return this.prisma.category.delete({ where: { id } });
  }
}
