import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Account } from './account.entity';

export type UserRole = 'admin' | 'user';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  role: UserRole;

  @ManyToOne(() => Account, account => account.users)
  account: Account;
}