import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ChatUsers')
export class ChatUser {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 40, default: '' })
  userID: string;

  @Column({ type: 'varchar', length: 40, default: '' })
  clientID: string;

  @Column({ type: 'datetime', precision: 6 })
  lastActivity: Date;
}
