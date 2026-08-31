import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from '@finanzapp/shared-types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar categorías del sistema y personalizadas' })
  async findAll(@CurrentUser() user: any) {
    return this.categoriesService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear categoría personalizada con clasificación 50/30/20' })
  async create(@CurrentUser() user: any, @Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar categoría personalizada' })
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.categoriesService.delete(user.id, id);
  }
}
