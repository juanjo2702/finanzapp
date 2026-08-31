import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto, UpdateAccountDto } from '@finanzapp/shared-types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las cuentas y billeteras del usuario' })
  async findAll(@CurrentUser() user: any) {
    return this.accountsService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una cuenta específica' })
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.accountsService.findOne(user.id, id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva cuenta bancaria, efectivo o billetera' })
  async create(@CurrentUser() user: any, @Body() dto: CreateAccountDto) {
    return this.accountsService.create(user.id, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar configuración de una cuenta' })
  async update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateAccountDto) {
    return this.accountsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Archivar/Eliminar cuenta' })
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.accountsService.delete(user.id, id);
  }
}
