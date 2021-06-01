import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeController } from './trade.controller';
import { TradeRepository } from './trade.repository';
import { TradeRequestRepository } from './tradeRequest.repository';
import { TradeService } from './trade.service';
import { TradeTXRepository } from './tradeTX.repository';
import { PostModule } from 'src/post/post.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TradeTXRepository,
      TradeRequestRepository,
      TradeRepository,
    ]),
    PostModule,
    UserModule,
  ],
  providers: [TradeService],
  controllers: [TradeController],
  exports: [TradeService],
})
export class TradeModule {}
