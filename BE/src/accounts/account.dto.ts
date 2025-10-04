import { UserRole } from './entities/user.entity';

export class UserDto {
  name: string;
  role: UserRole;
  age?: number;
}

export class AccountDto {
  id: string;
  users: UserDto[];
}

export class CreateUserDto {
  name: string;
  role: UserRole;
  age?: number;
}