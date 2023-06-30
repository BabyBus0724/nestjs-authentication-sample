import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from "@nestjs/core";

import { jwtConstants } from "./constants/constants";
import { User, UserSchema } from "./schema/user.schema";
import { AuthRepository } from "./repositories/auth.repository";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./guards/auth.guard";

@Module({
    imports: [
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        PassportModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: {expiresIn: '3600s'}
        })
    ],
    controllers: [AuthController],
    // providers: [AuthService, AuthRepository,{
    //     provide: APP_GUARD,
    //     useClass: AuthGuard
    // }],
    providers: [AuthService, AuthRepository, AuthGuard],
    exports: [AuthService, AuthRepository]
})
export class AuthModule {}