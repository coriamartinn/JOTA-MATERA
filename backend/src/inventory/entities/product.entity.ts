import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  name!: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost!: number;
  @Column({ type: 'int', default: 0 })
  stock!: number;
  @Column({ type: 'int', default: 0 })
  stockMin!: number;

  @ManyToOne(() => Category, (cat: Category) => cat.products, {
    onDelete: 'SET NULL',
  })
  categories!: Category;
  @Column({ type: 'json', nullable: true })
  images?: Record<string, string>;
  @Column({ type: 'int', default: 0 })
  sales!: number;
}
