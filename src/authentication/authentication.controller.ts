import { Body, Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { response, Response } from 'express';
import CreateUserDto from 'src/users/dto/create-user.dto';
import { AuthenticationService } from './authentication.service';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import RequestWithUser from './requestWithUser.interface';

@Controller('authentication')
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService
    ){}

    @Post('register')
    async register(@Body() registrationData: CreateUserDto) {
        return this.authenticationService.register(registrationData);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('login')
    async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
        const { user } = request;
        const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
        
        response.setHeader('Set-Cookie', cookie);
        user.password = undefined;
        return response.send(user);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Post('logout')
    async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
        response.setHeader('Set-Cookie', this.authenticationService.getCookieForLogout());
        return response.sendStatus(200);   
    }
}
