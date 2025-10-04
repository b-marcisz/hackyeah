import { IsDate, IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto { 
    @ApiProperty({ 
        description: 'Card title',
        example: 'Number 42'
    })
    @IsNotEmpty()
    title : string ;
    
    @ApiProperty({ 
        description: 'Card description',
        example: 'The answer to life, the universe, and everything'
    })
    @IsNotEmpty()
    description : string ;
}