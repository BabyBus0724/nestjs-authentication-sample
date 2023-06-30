import { Body, Controller, Post, HttpCode, HttpStatus, Res, Req, BadRequestException, UseGuards, Get } from '@nestjs/common';
import {Response, Request} from 'express';
import { InjectConnection } from '@nestjs/mongoose'
import { Connection, Schema as MongooseSchema } from 'mongoose';


import { SignupAuthDto } from './dto/signupAuth.dto';
import { AuthService } from './auth.service';
import { SigninAuthDto } from './dto/signinAuth.dto';
import { AuthGuard } from './guards/auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
// import { Public } from 'src/decorators/auth.public.dct';

@Controller('auth')
export class AuthController {

    constructor(@InjectConnection() private readonly mongoConnection: Connection, private authService: AuthService ) {}

    @Post('/register')
    async signUp(@Body(new ValidationPipe()) signupAuthDto: SignupAuthDto, @Res() res: Response ) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        try {
            const newUser = await this.authService.signUp(signupAuthDto, session);
            
            await session.commitTransaction();
            return res.status(HttpStatus.CREATED).send(newUser);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }

    @Post('/login')
    async signIn(@Body() signinAuthDto: SigninAuthDto, @Res() res: Response) {
        const session = await this.mongoConnection.startSession();
        session.startTransaction();
        try {
            const token = await this.authService.signIn(signinAuthDto, session);
            await session.commitTransaction();
            return res.status(HttpStatus.OK).send(token);
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException(error);
        } finally {
            session.endSession();
        }
    }

    @UseGuards(AuthGuard)
    @Get('/getUser')
    async getUser(@Req() req: Request) {
        return req.user;
    }
}