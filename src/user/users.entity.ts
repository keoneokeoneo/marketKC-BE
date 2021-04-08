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

  @Column({ length: 40, nullable: false })
  userWallet: string = '';

  @Column({ nullable: false })
  userImgID: string = '';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
