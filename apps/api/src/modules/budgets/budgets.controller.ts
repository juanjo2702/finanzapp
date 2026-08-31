import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from '@finanzapp/shared-types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Budgets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar presupuestos con progreso y consumo actual' })
  async findAll(@CurrentUser() user: any) {
    return this.budgetsService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Definir nuevo presupuesto por categoría' })
  async create(@CurrentUser() user: any, @Body() dto: CreateBudgetDto) {
    return this.budgetsService.create(user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar presupuesto' })
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.budgetsService.delete(user.id, id);
  }
}
