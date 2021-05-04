import { S3_BASE_URL } from 'src/config';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  userID: string;

  @Column({ nullable: false })
  userEmail: string;

  @Column({ nullable: false })
  userPW: string;

  @Column({ nullable: false })
  userName: string;

  @Column({ length: 42, nullable: false })
  userWalletAddr = '';

  @Column({ nullable: false })
  userProfileImgUrl = `${S3_BASE_URL}/profileImgs/default-profile-img.png`;

  @Column({ nullable: false })
  userLocation = '';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
