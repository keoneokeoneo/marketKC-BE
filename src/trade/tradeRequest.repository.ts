import { EntityRepository, Repository } from 'typeorm';
import { TradeRequest } from './tradeRequest.entity';

@EntityRepository(TradeRequest)
export class TradeRequestRepository extends Repository<TradeRequest> {}
