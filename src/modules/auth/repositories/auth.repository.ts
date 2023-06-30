import { ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


import { User } from '../schema/user.schema';
import { SignupAuthDto } from '../dto/signupAuth.dto';
import { SigninAuthDto } from '../dto/signinAuth.dto';

export class AuthRepository {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        private jwtService: JwtService
    ) {}

    async signUp(signupAuthDto: SignupAuthDto, session: ClientSession) {
        
        const user = await this.userModel.findOne({ email: signupAuthDto.email });
        
        if(user) {
            throw new ConflictException('Client Already Exists!');
        }

        const newUser = new this.userModel({
            name: signupAuthDto.name,
            email: signupAuthDto.email,
            password: await bcrypt.hash(signupAuthDto.password, 10)
        });

        try {
            const result = await newUser.save({session});
            return result
        } catch (error) {
            throw new InternalServerErrorException('Error al consultar la BD', error);
        }
    }


    async signIn(signinAuthDto: SigninAuthDto, session: ClientSession) {
        const user = await this.userModel.findOne({email: signinAuthDto.email});
        if(!user) {
            throw new ConflictException('Client Not Exists!');
        }
        // console.log(user);
        try {
            const isMatch = await bcrypt.compare(signinAuthDto.password, user.password);
            if(!isMatch) {
                throw new ConflictException('Password is not correct.')
            }
            const payload = { id: user.id, name: user.name, email: user.email }
            return {
                access_token: 'Bearer ' + this.jwtService.sign(payload)
            }
        } catch (error) {
            throw new InternalServerErrorException('Error al consultar la BD', error);
        }
        // return {
        //     access_token: this.jwtService.sign(payload)
        // }
    }

    async validateUser(email:string, pass:string, session: ClientSession): Promise<any> {
        
        let user = await this.userModel.findOne({email: email});
        console.log(user);
        
        if(user && bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            console.log(result);
            return result;
        } else {
            return null;
        }
    }
}