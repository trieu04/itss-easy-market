import { Module } from "@nestjs/common";
import { MealController } from "./meal.controller";
import { MealService } from "./meal.service";
import { DatabaseModule } from "../database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [MealController],
  providers: [MealService],
})
export class MealModule {}
