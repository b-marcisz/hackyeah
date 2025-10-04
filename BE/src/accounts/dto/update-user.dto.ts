import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsInt, IsObject } from 'class-validator';
import { UserRole, ThemeColor, UserSettings } from './create-user.dto';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ enum: ['pinkPurple', 'blue', 'green', 'pink', 'orange', 'lavender'] })
  @IsOptional()
  @IsEnum(['pinkPurple', 'blue', 'green', 'pink', 'orange', 'lavender'])
  color?: ThemeColor;

  @ApiPropertyOptional({ type: UserSettings })
  @IsOptional()
  @IsObject()
  settings?: UserSettings;
}