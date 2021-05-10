import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostImg } from './postImg.entity';

@Entity('Post')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  writer: string; // Seller ID

  @Column({ length: 100, nullable: false })
  title: string;

  @Column('text')
  content: string;

  @Column('int')
  price: number;

  @Column()
  category: number;

  @Column({ length: 255 })
  constractAddr: string;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  chats: number;

  @Column({ default: 0 })
  views: number;

  @Column({ length: 255, nullable: false })
  location: string;

  @Column({ default: 0 })
  status: number; // 판매중/거래중/거래완료

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PostImg, (postImg) => postImg.id)
  postImgs: PostImg[];
}
