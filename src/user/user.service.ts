import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { Register } from './user.type';
import * as Bcrypt from 'bcryptjs';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly categoryService: CategoryService,
  ) {}

  async addUser(register: Register) {
    try {
      const regUser = await this.userRepository.create();

      // Encode User PW
      const salt: string = await Bcrypt.genSalt(10);
      const encodedPW: string = await Bcrypt.hash(register.password, salt);
      const date = new Date(Date.now());

      const searchedCategories = await this.categoryService.getAllCategories();
      const userCategories = searchedCategories.map((category) => category.id);

      regUser.name = register.name;
      regUser.email = register.email;
      regUser.password = encodedPW;
      regUser.id = uuid();
      regUser.createdAt = date;
      regUser.updatedAt = date;
      regUser.subscribedCategories = userCategories;

      return await this.userRepository.save(regUser);
    } catch (e) {
      Logger.error(e);
    }
  }

  async getUserByEmail(email: string) {
    try {
      const searchedUser = await this.userRepository.findOne({
        where: {
          email: email,
        },
      });
      return searchedUser;
    } catch (e) {
      Logger.error(e);
    }
  }

  async getUserByID(id: string) {
    try {
      const searchedUser = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });
      return searchedUser;
    } catch (e) {
      Logger.error(e);
    }
  }

  async updateLastActivity(id: string) {
    try {
      await this.userRepository.update(
        { id: id },
        { updatedAt: new Date(Date.now()) },
      );
    } catch (e) {
      Logger.error(e);
    }
  }

  async updateUserCategories(id: string, categories: number[]) {
    try {
      return await this.userRepository.update(
        { id: id },
        { subscribedCategories: categories, updatedAt: new Date(Date.now()) },
      );
    } catch (e) {
      Logger.error(e);
    }
  }
}
