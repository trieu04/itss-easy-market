import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { FoodCategoryEntity } from '../../entities/food-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FoodCategoryService extends TypeOrmCrudService<FoodCategoryEntity>{
    constructor(@InjectRepository(FoodCategoryEntity) public foodCategoryRepo: Repository<FoodCategoryEntity>) {
        super(foodCategoryRepo);
    }
}
