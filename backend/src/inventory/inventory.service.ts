import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create(createInventoryDto: CreateInventoryDto) {
    const newProduct = this.productRepository.create(createInventoryDto);

    const savedProduct = this.productRepository.save(newProduct);

    return savedProduct;
  }

  findAll() {
    return this.productRepository.find({
      relations: { categories: true },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} inventory`;
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    const previousProduct = await this.productRepository.findOneBy({ id });

    if (!previousProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    const updateProduct = this.productRepository.merge(
      previousProduct,
      updateInventoryDto,
    );

    return this.productRepository.save(updateProduct);
  }

  remove(id: number) {
    return this.productRepository.delete({ id });
  }
}
