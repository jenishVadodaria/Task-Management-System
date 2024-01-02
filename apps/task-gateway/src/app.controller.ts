/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './roles.decorator';
import { Role } from './roles.enum';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('v1')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('auth/signup')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  async signup(@Body() user: RegisterDto, @Res() res: Response) {
    try {
      await this.appService.registerUser(user);
      return res.status(HttpStatus.CREATED).json({
        message: 'User registered successfully',
      });
    } catch (error) {
      if (error.message === 'User already exists') {
        return res.status(HttpStatus.CONFLICT).json({
          message: 'User already exists',
        });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'User registration failed',
      });
    }
  }

  @Post('auth/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body() user: LoginDto,
    @Headers() headers,
    @Res() res: Response,
  ) {
    const result = await this.appService.authenticateUser(
      user.email,
      user.username,
      headers,
    );
    if (result instanceof Error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: result.message,
      });
    }
    const payload = { _id: result._id, type: result.type };
    const accessToken = this.jwtService.sign(payload);

    return res.status(HttpStatus.OK).json({
      message: 'User logged in successfully',
      data: {
        accessToken,
        _id: result._id,
        email: result.email,
        name: result.username,
      },
    });
  }

  @Get('allusers')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllUsers(@Res() res: Response) {
    try {
      const users = await this.appService.getAllUsers();
      return res.status(HttpStatus.OK).json({
        message: 'Users retrieved successfully',
        data: users,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Users retrieval failed',
      });
    }
  }

  @Post('task/create')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  async createTask(@Body() task: CreateTaskDto, @Res() res: Response) {
    try {
      await this.appService.createTask(task);
      return res.status(HttpStatus.CREATED).json({
        message: 'Task created successfully',
      });
    } catch (error) {
      if (error.message === 'Task already exists') {
        return res.status(HttpStatus.CONFLICT).json({
          message: 'Task already exists',
        });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Task creation failed',
      });
    }
  }

  @Patch('task/update/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  async updateTask(
    @Param() params: any,
    @Body() updateTask: UpdateTaskDto,
    @Res() res: Response,
  ) {
    try {
      await this.appService.updateTask(params.id, updateTask);
      return res.status(HttpStatus.OK).json({
        message: 'Task updated successfully',
      });
    } catch (error) {
      if (error.message === 'Task not found') {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Task not found',
        });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Task update failed',
      });
    }
  }

  @Get('task')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findTasks(@Query() query: any, @Res() res: Response) {
    try {
      const tasks = await this.appService.findTasks(query.find, query.sortBy);
      return res.status(HttpStatus.OK).json({
        message: 'Tasks retrieved successfully',
        data: tasks,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Tasks retrieval failed',
      });
    }
  }

  @Get('user/alltasks')
  @Roles(Role.DEFAULT, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findUserTasks(@Req() req: any, @Res() res: Response) {
    try {
      const tasks = await this.appService.findUserTasks(req.user._id);
      return res.status(HttpStatus.OK).json({
        message: 'User tasks retrieved successfully',
        data: tasks,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'User tasks retrieval failed',
      });
    }
  }

  @Patch('task/complete/:id')
  @Roles(Role.DEFAULT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  async markTaskAsComplete(
    @Param() params: any,
    @Req() req: any,
    @Res() res: Response,
  ) {
    try {
      await this.appService.markTaskAsComplete(params.id, req.user._id);
      return res.status(HttpStatus.OK).json({
        message: 'Task marked as complete successfully',
      });
    } catch (error) {
      if (error.message === 'Task not found') {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Task not found',
        });
      }
      if (
        error.message === 'You are not authorized to mark this task as complete'
      ) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'You are not authorized to mark this task as complete',
        });
      }
      if (error.message === 'Task already marked as complete') {
        return res.status(HttpStatus.CONFLICT).json({
          message: 'Task already marked as complete',
        });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Task mark as complete failed',
      });
    }
  }
}
