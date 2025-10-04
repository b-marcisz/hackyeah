import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Account } from './account.entity';

export type UserRole = 'admin' | 'user';

export type ThemeColor =
  | 'pinkPurple'   // #F093FB - Różowy/Fioletowy
  | 'blue'         // #4FACFE - Niebieski
  | 'green'        // #43E97B - Zielony
  | 'pink'         // #FF6B9D - Różowy
  | 'orange'       // #FFA502 - Pomarańczowy
  | 'lavender';    // #A29BFE - Jasny fiolet

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

  @Column({ type: 'enum', enum: ['pinkPurple', 'blue', 'green', 'pink', 'orange', 'lavender'], nullable: true })
  color?: ThemeColor;

  @Column({ type: 'json', nullable: true })
  settings?: Record<string, any>;
}