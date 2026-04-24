import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    
    if (!requiredRoles) {
      return of(true);
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      return of(false);
    }

    const hasRole = requiredRoles.includes(user.role);
    return of(hasRole);
  }
}
