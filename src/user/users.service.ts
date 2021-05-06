import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Users } from './users.entity';
import { UsersRepository } from './users.repository';
import { Register } from './users.type';
import * as Bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: UsersRepository,
  ) {}

  async addUser(register: Register) {
    const regUser = await this.usersRepository.create();

    // Encode User PW
    const salt: string = await Bcrypt.genSalt(10);
    const pw: string = await Bcrypt.hash(register.userPW, salt);
    const date = new Date(Date.now());

    regUser.userName = register.userName;
    regUser.userEmail = register.userEmail;
    regUser.userPW = pw;
    regUser.userID = uuid();
    regUser.createdAt = date;
    regUser.updatedAt = date;
    regUser.subscribedCategories = [1, 2, 3];

    const test = [1, 2, 3];
    console.log(typeof test, test);

    await this.usersRepository.save(regUser);
  }

  async getUserByEmail(userEmail: string) {
    const searchedUser = await this.usersRepository.findOne({
      where: {
        userEmail: userEmail,
      },
    });
    return searchedUser;
  }

  async getUserByID(userID: string) {
    const searchedUser = await this.usersRepository.findOne({
      where: { userID: userID },
    });

    return searchedUser;
  }

  async updateLastActivity(userID: string) {
    await this.usersRepository.update(
      { userID: userID },
      { updatedAt: new Date(Date.now()) },
    );
  }
}
