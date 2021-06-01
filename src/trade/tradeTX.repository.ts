import { EntityRepository, Repository } from 'typeorm';
import { TradeTX } from './tradeTX.entity';

@EntityRepository(TradeTX)
export class TradeTXRepository extends Repository<TradeTX> {}
