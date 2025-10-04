import { IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCardDto { 
    @ApiProperty({ 
        description: 'Card title',
        example: 'Updated Number 42',
        required: false
    })
    @IsNotEmpty()
    @IsOptional()
    title? : string;

    @ApiProperty({ 
        description: 'Card description',
        example: 'Updated description for the card',
        required: false
    })
    @IsOptional()
    @IsNotEmpty()
    description? : string;
}