import { S3_BASE_URL } from 'src/config';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('User')
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
}
