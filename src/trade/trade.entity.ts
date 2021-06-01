import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Trades')
export class Trade {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  postID: number;

  @Column('int')
  price: number;

  @Column({ type: 'varchar', default: 'Init' })
  stage: 'Init' | 'Waiting' | 'Done' | 'Rejected';

  @Column('uuid')
  buyerID: string;

  @Column('varchar')
  buyerName: string;

  @Column('varchar')
  sellerName: string;

  @Column('uuid')
  sellerID: string;

  @Column('varchar')
  from: string;

  @Column('varchar')
  to: string;
}
