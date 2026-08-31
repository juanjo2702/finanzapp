import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Obtener métricas consolidadas (Patrimonio, Flujo del Mes, Regla 50/30/20, Runway)' })
  async getSummary(@CurrentUser() user: any) {
    return this.analyticsService.getDashboardSummary(user.id);
  }

  @Get('cashflow')
  @ApiOperation({ summary: 'Histórico mensual de ingresos vs gastos (para gráficos)' })
  async getCashFlow(@CurrentUser() user: any) {
    return this.analyticsService.getCashFlowMonthlyHistory(user.id);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Distribución de gastos por categoría' })
  async getCategories(@CurrentUser() user: any) {
    return this.analyticsService.getCategoryBreakdown(user.id);
  }

  @Get('sankey')
  @ApiOperation({ summary: 'Datos estructurados para diagrama de flujo Sankey' })
  async getSankey(@CurrentUser() user: any) {
    return this.analyticsService.getSankeyData(user.id);
  }
}
