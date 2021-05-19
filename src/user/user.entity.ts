import { S3_BASE_URL } from 'src/config';
import { Post } from 'src/post/post.entity';
import { ChatRoom } from 'src/chat/chatroom.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatMsg } from 'src/chat/chatmsg.entity';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  name: string;

  @Column({ length: 42, nullable: false, default: '' })
  walletAddr: string;

  @Column({
    nullable: false,
    default: `${S3_BASE_URL}/profileImgs/default-profile-img.png`,
  })
  profileImgUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('simple-array')
  subscribedCategories: number[];

  @OneToMany(() => Post, (post) => post.seller, {
    cascade: true,
  })
  posts: Post[];

  @OneToMany(() => ChatRoom, (buyingChat) => buyingChat.buyer, {
    cascade: true,
  })
  buyingChats: ChatRoom[];

  @OneToMany(() => ChatRoom, (sellingChat) => sellingChat.seller, {
    cascade: true,
  })
  sellingChats: ChatRoom[];

  @OneToMany(() => ChatMsg, (chatmsg) => chatmsg.sender)
  chatMsgs: ChatMsg[];
}
