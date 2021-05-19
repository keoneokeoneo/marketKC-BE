import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatRoom } from './chatroom.entity';

@Entity('ChatMsgs')
export class ChatMsg {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ChatRoom, (chatroom) => chatroom.chatMsgs, { eager: true })
  chatroom: ChatRoom;

  @ManyToOne(() => User, (user) => user.chatMsgs, { eager: true })
  sender: User;

  @Column({ type: 'datetime', precision: 6 })
  createdAt: Date;

  @Column({ type: 'varchar', nullable: false })
  text: string;
}
