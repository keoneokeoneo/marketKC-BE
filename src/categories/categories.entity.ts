import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Categories')
export class Categories {
  @PrimaryGeneratedColumn('increment')
  categoryID: number;

  @Column()
  categoryName: string;
}
