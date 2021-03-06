import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/create-user.dto';
import User from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) { }

    async getByEmail(email: string) {
        const user = await this.usersRepository.findOne({ email });
        if (user)
            return user
        throw new NotFoundException("User not found !");
    }

    async getById(id: number) {
        const user = await this.usersRepository.findOne({ id });
        if (user)
            return user;
        throw new NotFoundException("User with this id does not exist");
    }

    async create(userData: CreateUserDto) {
        const newUser = await this.usersRepository.create(userData);
        await this.usersRepository.save(newUser);
        return newUser;
    }
}
