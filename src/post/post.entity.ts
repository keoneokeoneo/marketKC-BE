import { Category } from 'src/category/category.entity';
import { ChatRoom } from 'src/socket/chatroom.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostImg } from './postImg.entity';

@Entity('Posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  title: string;

  @Column('text')
  content: string;

  @Column('int')
  price: number;

  @Column({ length: 255, default: '' })
  contractAddr: string;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  chats: number;

  @Column({ default: 0 })
  views: number;

  @Column({ length: 255, nullable: false })
  location: string;

  @Column({ default: '판매중' })
  status: '판매중' | '거래중' | '거래완료'; // 판매중/거래중/거래완료

  @Column({ type: 'datetime', precision: 6 })
  createdAt: Date;

  @Column({ type: 'datetime', precision: 6 })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Category, (category) => category.posts)
  category: Category;

  @OneToMany(() => PostImg, (postImg) => postImg.post, { cascade: true })
  postImgs: PostImg[];

  @OneToMany(() => ChatRoom, (chatroom) => chatroom.post)
  chatrooms: ChatRoom[];
}
