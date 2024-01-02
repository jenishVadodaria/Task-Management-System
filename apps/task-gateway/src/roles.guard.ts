/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from './roles.enum';
import { RolesKey } from './roles.decorator';
import { AppService } from './app.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly appService: AppService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(RolesKey, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userId = request.user._id;
    return this.validateUser(userId, requiredRoles);
  }

  async validateUser(userId: string, requiredRoles: Role[]): Promise<boolean> {
    const user: any = await this.appService.getUserRoleById(userId, 'type');
    const auth = requiredRoles.some((role) => user.type.includes(role));
    return auth;
  }
}
