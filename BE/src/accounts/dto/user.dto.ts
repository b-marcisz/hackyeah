import { UserRole } from '../enums/user-role.enum';

export class UserDto {
  name: string;
  role: UserRole;
  age?: number;
}