import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({name:  'number_associations'})
export class NumberAssociation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @Column({ length: 100 })
  hero: string;

  @Column({ length: 100 })
  action: string;

  @Column({ length: 100 })
  object: string;

  @Column('text', { nullable: true })
  explanation: string;

  @Column({ default: false })
  is_primary: boolean;

  @Column('float', { default: 0 })
  rating: number;

  @Column({ default: 0 })
  total_votes: number;

  @CreateDateColumn()
  created_at: Date;
} 