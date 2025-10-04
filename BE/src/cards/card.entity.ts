import { Column, CreateDateColumn, Entity,PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class  Card{ 
    @ApiProperty({ description: 'Card unique identifier', example: '123e4567-e89b-12d3-a456-426614174000' })
    @PrimaryGeneratedColumn('uuid')
    id : string ;

    @ApiProperty({ description: 'Card title', example: 'Number 42' })
    @Column()
    title : string ;

    @ApiProperty({ description: 'Card description', example: 'The answer to life, the universe, and everything' })
    @Column()
    description : string ;

    @ApiProperty({ description: 'Creation timestamp', example: '2024-01-01T00:00:00Z' })
    @CreateDateColumn({ name : 'created_at'})
    createdAt : Date ;

    @ApiProperty({ description: 'Last update timestamp', example: '2024-01-01T00:05:00Z' })
    @UpdateDateColumn({ name : 'updated_at'})
    updatedAt : Date ;

}