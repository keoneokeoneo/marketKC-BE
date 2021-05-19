import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChatMsg } from './chatmsg.entity';

@Entity('ChatRooms')
export class ChatRoom {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (buyer) => buyer.buyingChats, { eager: true })
  buyer: User;

  @ManyToOne(() => User, (seller) => seller.sellingChats, { eager: true })
  seller: User;

  @ManyToOne(() => Post, (post) => post.chatrooms)
  post: Post;

  @OneToMany(() => ChatMsg, (chatmsg) => chatmsg.chatroom, {
    cascade: true,
  })
  chatMsgs: ChatMsg[];
}
