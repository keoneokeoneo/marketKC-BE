import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatRoom } from './chatroom.entity';

@Entity('Messages')
export class Message {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ChatRoom, (chatroom) => chatroom.messages)
  chatroom: ChatRoom;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;

  @Column({ type: 'datetime', precision: 6 })
  createdAt: Date;
}
