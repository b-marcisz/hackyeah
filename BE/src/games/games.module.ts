import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { NumberAssociation } from '../entities/number-association.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, NumberAssociation])],
  providers: [GamesService],
  controllers: [GamesController],
})
export class GamesModule {}
