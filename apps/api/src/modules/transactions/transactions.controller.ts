import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, TransactionFilterDto } from '@finanzapp/shared-types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar y filtrar transacciones con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'accountId', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(@CurrentUser() user: any, @Query() filter: TransactionFilterDto) {
    return this.transactionsService.findAll(user.id, filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una transacción' })
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.transactionsService.findOne(user.id, id);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar nueva transacción (Gasto, Ingreso, Transferencia)' })
  async create(@CurrentUser() user: any, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar transacción y revertir balance' })
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.transactionsService.delete(user.id, id);
  }
}
