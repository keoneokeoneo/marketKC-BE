import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatRoom } from './chatroom.entity';

@Entity('Messages')
export class Message {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ChatRoom, (chatroom) => chatroom.messages, { eager: true })
  chatroom: ChatRoom;

  @ManyToOne(() => User, (user) => user.messages, { eager: true })
  sender: User;

  @Column({ type: 'datetime', precision: 6 })
  createdAt: Date;

  @Column({ type: 'varchar', nullable: false })
  msg: string;
}
