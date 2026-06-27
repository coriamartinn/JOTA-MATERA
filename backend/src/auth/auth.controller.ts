import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  login(@Body() body: AdminLoginDto) {
    return this.authService.validateAdminLogin(body);
  }

  @Post('admin/verify')
  verify(@Headers('authorization') authorization?: string) {
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : authorization;

    return this.authService.verifyAdminToken(token);
  }
}
