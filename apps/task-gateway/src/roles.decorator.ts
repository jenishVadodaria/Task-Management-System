/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import { Role } from './roles.enum';

export const RolesKey = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(RolesKey, roles);
