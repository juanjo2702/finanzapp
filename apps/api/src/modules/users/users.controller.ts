import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Currency } from '@finanzapp/shared-types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Obtener información y estadísticas de la cuenta de usuario' })
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.id);
  }

  @Patch('base-currency')
  @ApiOperation({ summary: 'Cambiar moneda base de referencia (BOB, USD, etc.)' })
  async updateBaseCurrency(@CurrentUser() user: any, @Body('baseCurrency') baseCurrency: Currency) {
    return this.usersService.updateBaseCurrency(user.id, baseCurrency);
  }
}
