import { Controller, Get, Post, Put, Delete, Body, Param, Query } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { Product } from "./entities/product.entity";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number
  ): Promise<Product[]> {
    return this.productsService.findAll(search, category, limit, page);
  }

  @Get(':id')
  async getProduct(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(+id);
  }

  @Post()
  async createProduct(@Body() product: Partial<Product>): Promise<Product> {
    return this.productsService.create(product);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() product: Partial<Product>
  ): Promise<Product> {
    return this.productsService.update(+id, product);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(+id);
  }

  @Get('search/suggestions')
  async getSearchSuggestions(@Query('q') query: string): Promise<string[]> {
    return this.productsService.getSearchSuggestions(query);
  }
}
