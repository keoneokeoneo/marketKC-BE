import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';

@Entity('ChatRooms')
export class ChatRoom {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (buyer) => buyer.buyingChats)
  buyer: User;

  @ManyToOne(() => User, (seller) => seller.sellingChats)
  seller: User;

  @ManyToOne(() => Post, (post) => post.chatrooms)
  post: Post;

  @OneToMany(() => Message, (message) => message.chatroom)
  messages: Message[];

  @Column({ type: 'datetime', precision: 6 })
  createdAt: Date;

  @Column({ type: 'datetime', precision: 6 })
  updatedAt: Date;
}
