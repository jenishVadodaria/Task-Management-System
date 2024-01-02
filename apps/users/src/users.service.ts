import { Injectable } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { CreateUserDto } from './user-create.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async createUser(user: CreateUserDto) {
    return await this.userRepository.create(user);
  }

  async findAllUsers() {
    return await this.userRepository.findAll();
  }

  async findUserByIdAndField(id: string, field: string) {
    return await this.userRepository.findByIdAndField(id, field);
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findUserByEmail(email);
  }

  async deleteUser(id: string) {
    return await this.userRepository.remove(id);
  }
}
