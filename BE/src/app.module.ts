import { Module } from '@nestjs/common';
import { CardsModule } from './cards/cards.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenApiModule } from './AI/open-api/open-api.module';
import { NumberAssociation } from './entities/number-association.entity';
import { GamesModule } from './games/games.module';
import { Game } from './games/game.entity';
import { Card } from './cards/card.entity';
import { AccountsModule } from './accounts/accounts.module';
import { Account } from './accounts/entities/account.entity';
import { User } from './accounts/entities/user.entity';
<<<<<<< HEAD
import { UserSession } from './accounts/entities/session.entity';
=======
import { UserProgress } from './entities/user-progress.entity';
>>>>>>> e2d37e6b (update)

@Module({
  imports: [
    CardsModule,
    OpenApiModule,
    GamesModule,
    AccountsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
<<<<<<< HEAD
          entities: [NumberAssociation, Card, Game, User, Account, UserSession],
=======
          entities: [NumberAssociation, Card, Game, User, Account, UserProgress],
>>>>>>> e2d37e6b (update)
          autoLoadEntities: false,
          synchronize: true
        } as any;
      
        console.log('📡 DB CONFIG:', config); // ← добавь это
      
        return config;
      },
    }),
  ]
})
export class AppModule {}
