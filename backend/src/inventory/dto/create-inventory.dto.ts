import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cost!: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockMin?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsObject()
  images?: Record<string, string>;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  sales?: number;
}
