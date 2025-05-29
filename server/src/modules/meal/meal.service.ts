import { TypeOrmCrudService } from "@dataui/crud-typeorm";
import { Injectable } from "@nestjs/common";
import { MealEntity } from "../../entities/meal.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class MealService extends TypeOrmCrudService<MealEntity> {
  constructor(@InjectRepository(MealEntity) public mealRepo: Repository<MealEntity>) {
    super(mealRepo);
  }
}
