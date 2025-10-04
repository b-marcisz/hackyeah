import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { User } from './entities/user.entity';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { UserSession } from './entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User, UserSession])],
  providers: [AccountsService],
  controllers: [AccountsController],
  exports: [AccountsService],
})
export class AccountsModule {}