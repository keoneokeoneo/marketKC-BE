import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity('PostImgs')
export class PostImg {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 255, nullable: false })
  url: string;

  @ManyToOne(() => Post, (post) => post.postImgs, {
    onDelete: 'CASCADE',
  })
  post: Post;
}
