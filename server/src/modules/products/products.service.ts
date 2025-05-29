import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { Product } from "./entities/product.entity";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(
    search?: string,
    category?: string,
    limit?: number,
    page?: number
  ): Promise<Product[]> {
    const query = this.productRepository.createQueryBuilder('product');
    
    if (search) {
      query.where(
        'product.name ILIKE :search OR product.description ILIKE :search',
        { search: `%${search}%` }
      );
    }
    
    if (category) {
      query.andWhere('product.category = :category', { category });
    }
    
    query.andWhere('product.isActive = :isActive', { isActive: true });
    
    if (limit) {
      query.limit(limit);
    }
    
    if (page && limit) {
      query.offset((page - 1) * limit);
    }
    
    return query.getMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, isActive: true }
    });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return product;
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  async update(id: number, productData: Partial<Product>): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, productData);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    product.isActive = false;
    await this.productRepository.save(product);
  }

  async getSearchSuggestions(query: string): Promise<string[]> {
    const products = await this.productRepository.find({
      where: {
        name: Like(`%${query}%`),
        isActive: true
      },
      select: ['name'],
      take: 10
    });
    
    return products.map(p => p.name);
  }
}
