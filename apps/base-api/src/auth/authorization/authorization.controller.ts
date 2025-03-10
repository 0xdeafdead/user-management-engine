import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { UpdateUserRolesDTO } from '../DTOs/updateUserRole.dto';
import { UpdateRolePermissionsDTO } from '../DTOs/updatePermissionFromRole.dto';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { Observable } from 'rxjs';
import { Role } from '@prisma/client';
import { BaseGuard } from '../../guards';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly service: AuthorizationService) {}

  @Put('/user')
  updateUserRole(@Body() input: UpdateUserRolesDTO): Observable<boolean> {
    return this.service.updateRoleToUser(input);
  }

  @Put('/role')
  @UseGuards(BaseGuard)
  updateRolePermissions(
    @CurrentUser() user: string,
    @Body() input: UpdateRolePermissionsDTO
  ): Observable<Role> {
    return this.service.updatePermissionsToRole(user, input);
  }
}
