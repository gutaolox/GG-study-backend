import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

import { AuthService } from './auth/auth.service';

import { Public, Roles } from './metadata.definition';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Role } from './utils/constants';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('profile')
  @Roles(Role.Admin)
  getProfile(@Request() req) {
    return req.user;
  }
}
