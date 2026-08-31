import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto, Currency, AccountType } from '@finanzapp/shared-types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('El correo electrónico ya se encuentra registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        fullName: dto.fullName,
        baseCurrency: dto.baseCurrency as any,
      },
    });

    // Create default accounts for new user
    await this.prisma.account.createMany({
      data: [
        {
          userId: user.id,
          name: 'Billetera Efectivo',
          type: AccountType.CASH as any,
          currency: (dto.baseCurrency || Currency.BOB) as any,
          balance: 0,
          color: '#eab308',
        },
        {
          userId: user.id,
          name: 'Cuenta Principal',
          type: AccountType.CHECKING as any,
          currency: (dto.baseCurrency || Currency.BOB) as any,
          balance: 0,
          color: '#2563eb',
        },
      ],
    });

    const tokens = this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        baseCurrency: user.baseCurrency,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const tokens = this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        baseCurrency: user.baseCurrency,
      },
      ...tokens,
    };
  }

  private generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_SECRET || 'super_secret_finanzapp_jwt_key_development_2026_change_in_production',
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '30d',
        secret: process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_jwt_key_2026',
      }),
    };
  }
}
