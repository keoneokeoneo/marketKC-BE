import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TradeTXs')
export class TradeTX {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int')
  tradeID: number;

  @Column('int')
  postID: number;

  @Column({ type: 'varchar', nullable: false })
  txHash: string;

  @Column('uuid')
  senderID: string;

  @Column('uuid')
  receiverID: string;

  @Column('varchar')
  eventName: string;
}
