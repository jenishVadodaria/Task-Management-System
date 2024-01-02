/* eslint-disable @typescript-eslint/no-unused-vars */
// user.controller.ts
import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './user-create.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserEvent } from './events';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  create(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @MessagePattern({ cmd: 'getAllUsers' })
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @MessagePattern({ cmd: 'getUserRoleById' })
  findUserByIdAndField(@Payload() data) {
    return this.userService.findUserByIdAndField(data.id, data.field);
  }

  @MessagePattern({ cmd: 'getUserEmail' })
  findUserByEmail(@Payload() data) {
    return this.userService.findUserByEmail(data.email);
  }

  @EventPattern('user_created')
  handleUserCreated(data: CreateUserEvent) {
    this.userService.createUser(data);
  }

  @Delete(':id')
  remove(@Body('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
