import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Posts')
export class Posts {
  @PrimaryGeneratedColumn()
  postID: number;

  @Column({ nullable: false })
  userID: string; // Seller ID

  @Column({ length: 100, nullable: false })
  postTitle: string;

  @Column('text')
  postContent: string;

  @Column('int')
  postPrice: number;

  @Column()
  postCategoryID: number;

  @Column({ length: 255 })
  postContract: string;

  @Column({ default: 0 })
  postLikes: number;

  @Column({ default: 0 })
  postChats: number;

  @Column({ default: 0 })
  postViews: number;

  @Column({ length: 255, nullable: false })
  postLocation: string;

  @Column({ default: 0 })
  postStatus: number; // 판매중/거래중/거래완료

  @CreateDateColumn()
  createdAt: Date;
}
