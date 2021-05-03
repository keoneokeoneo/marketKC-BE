import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PostImgs')
export class PostImgs {
  @PrimaryGeneratedColumn()
  postImgID: number;

  @Column({ length: 255, nullable: false })
  postImgUrl: string;

  @Column()
  postID: number;
}
