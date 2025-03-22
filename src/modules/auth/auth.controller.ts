import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Request, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Kullanıcı girişi' })
  @ApiResponse({ status: 200, description: 'Başarılı giriş' })
  @ApiResponse({ status: 401, description: 'Geçersiz kimlik bilgileri' })
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(
      body.email,
      body.password,
    );
    if (!user) {
      throw new UnauthorizedException('Geçersiz email veya şifre');
    }
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Yeni kullanıcı kaydı' })
  @ApiResponse({ status: 201, description: 'Kullanıcı başarıyla oluşturuldu' })
  @ApiResponse({ status: 400, description: 'Geçersiz veri' })
  async register(@Body() body: any) {
    console.log(body,"*-*-*-*-");
    const existingUser = await this.usersService.findByEmail(body.email);
    if (existingUser) {
      throw new UnauthorizedException('Bu email adresi zaten kullanımda');
    }

    const user = await this.usersService.create(body) as UserDocument;
    const { password, ...result } = user.toObject();
    // return this.authService.login(result);

    // bu kısımda kayıt başarılı oluşturulacak, ama email doğrulaması sonrası giriş yapılacak
    return true;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı profili görüntüleme' })
  @ApiResponse({ status: 200, description: 'Kullanıcı profili' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }
    const { password, ...result } = (user as UserDocument).toObject();
    return result;
  }

  @Get('test-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async testAdmin(@Request() req) {
    return {
      message: 'You are admin!',
      user: req.user
    };
  }
} 