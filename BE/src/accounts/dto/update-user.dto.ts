import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsInt, IsObject, Matches } from 'class-validator';
import { UserRole, ThemeColor, UserSettings } from './create-user.dto';

export class UpdateUserDto {
  @ApiProperty({ description: 'Czterocyfrowy kod, np. 0013' })
  @IsString()
  @Matches(/^\d{4}$/, { message: 'code must be a 4-digit number string (e.g. 0013)' })
  code: string;

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