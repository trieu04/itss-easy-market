import { Module } from '@nestjs/common';
import { FoodCategoryController } from './food-category.controller';
import { FoodCategoryService } from './food-category.service';
import { DatabaseModule } from '../database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FoodCategoryController],
  providers: [FoodCategoryService]
})
export class FoodCategoryModule { }
