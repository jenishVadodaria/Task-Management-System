/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDate,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  priority: string;

  @IsNotEmpty()
  @IsOptional()
  @IsDateString()
  dueDate: Date;

  @IsNotEmpty()
  @IsBoolean()
  @IsOptional()
  isComplete: boolean;
}
