import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsInt, IsObject } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export type ThemeColor =
  | 'pinkPurple'   // #F093FB - Różowy/Fioletowy
  | 'blue'         // #4FACFE - Niebieski
  | 'green'        // #43E97B - Zielony
  | 'pink'         // #FF6B9D - Różowy
  | 'orange'       // #FFA502 - Pomarańczowy
  | 'lavender';    // #A29BFE - Jasny fiolet

export class UserSettings {
    @ApiProperty()
    @IsInt()
    timeLimit: number;
  }

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  age?: number;

  @ApiProperty({ enum: ['pinkPurple', 'blue', 'green', 'pink', 'orange', 'lavender'], required: false })
  @IsOptional()
  @IsEnum(['pinkPurple', 'blue', 'green', 'pink', 'orange', 'lavender'])
  color?: ThemeColor;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  settings?: UserSettings;
}