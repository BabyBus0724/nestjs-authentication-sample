import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientSession } from 'mongoose';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email:string, password:string, session: ClientSession): Promise<any> {
    const user = await this.authService.validateUser(email, password, session);
    
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}