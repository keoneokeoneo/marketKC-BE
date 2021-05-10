import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity('PostImg')
export class PostImg {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 255, nullable: false })
  url: string;

  @ManyToOne(() => Post, (post) => post.id)
  post: Post;
}
