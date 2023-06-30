import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ClientSession, Schema as MongooseSchema } from "mongoose";


import { AuthRepository } from "./repositories/auth.repository";
import { SignupAuthDto } from "./dto/signupAuth.dto";
import { SigninAuthDto } from "./dto/signinAuth.dto";

@Injectable()
export class AuthService {
    constructor(private readonly authRepository: AuthRepository ) {}

    async signUp(signupAuthDto: SignupAuthDto, session: ClientSession) {
        return await this.authRepository.signUp(signupAuthDto, session)
    }

    async signIn(signinAuthDto: SigninAuthDto, session: ClientSession) {
        return await this.authRepository.signIn(signinAuthDto, session);
    }

    async validateUser(email:string, password: string, session: ClientSession):Promise<any> {
        return this.authRepository.validateUser(email, password, session);
    }
}