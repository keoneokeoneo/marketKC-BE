import { EntityRepository, Repository } from 'typeorm';
import { Trade } from './trade.entity';

@EntityRepository(Trade)
export class TradeRepository extends Repository<Trade> {}
