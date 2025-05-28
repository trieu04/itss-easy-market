// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteRecipeEntity } from '../entities/favorite-recipe.entity';
import { FoodCategoryEntity } from '../entities/food-category.entity';
import { FoodItemEntity } from '../entities/food-items.entity';
import { GroupEntity } from '../entities/group.entity';
import { MealEntity } from '../entities/meal.entity';
import { RecipeEntity } from '../entities/recipe.entity';
import { ReportDataEntity } from '../entities/report-data.entity';
import { ShoppingItemEntity } from '../entities/shopping-item.entity';
import { ShoppingListEntity } from '../entities/shopping-list.entity';

@Module({
    imports: [TypeOrmModule.forFeature([
        FavoriteRecipeEntity,
        FoodCategoryEntity,
        FoodItemEntity,
        GroupEntity,
        MealEntity,
        RecipeEntity,
        ReportDataEntity,
        ShoppingItemEntity,
        ShoppingListEntity,
    ])],
    exports: [TypeOrmModule]
})
export class DatabaseModule { }
