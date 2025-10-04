import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Czterocyfrowy kod, np. 0013' })
  @IsString()
  @Matches(/^\d{4}$/, { message: 'code must be a 4-digit number string (e.g. 0013)' })
  code: string;
}