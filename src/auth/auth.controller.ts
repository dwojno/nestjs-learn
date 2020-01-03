import { Controller, Post, Body, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentials: AuthCredentialsDto
  ): Promise<void> {
    return this.authService.signUp(authCredentials);
  }

  @Post('/signIn')
  signIn(
    @Body(ValidationPipe) authCredentials: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentials);
  }
}
