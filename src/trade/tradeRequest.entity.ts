import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TradeRequests')
export class TradeRequest {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  postID: number;

  @Column('int')
  chatID: number;

  @Column({ type: 'uuid' })
  senderID: string;

  @Column({ type: 'uuid', nullable: false })
  receiverID: string;

  @Column({ type: 'bool', default: null })
  accepted: boolean;
}
