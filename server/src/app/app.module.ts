import { Module } from "@nestjs/common";
import { IsUniqueConstraint } from "../common/validators/is-unique.validator";
import { JwtConfigModule } from "../configs/jwt-config.module";
import { LoadConfigModule } from "../configs/load-config.module";
import { MailerConfigModule } from "../configs/mailer-config.module";
import { TypeOrmConfigModule } from "../configs/type-orm-config.module";
import { AuthModule } from "../modules/auth/auth.module";
import { HealthModule } from "../modules/health/health.module";
import { UsersModule } from "../modules/users/users.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ShoppingListModule } from "../modules/shopping-list/shopping-list.module";
import { MealModule } from "../modules/meal/meal.module";
import { ReportModule } from "../modules/report/report.module";
import { SuggestionModule } from "../modules/suggestion/suggestion.module";
import { FridgeModule } from "../modules/fridge/fridge.module";
import { GroupModule } from "../modules/group/group.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FavoriteRecipeEntity } from "../entities/favorite-recipe.entity";
import { FoodCategoryEntity } from "../entities/food-category.entity";
import { FoodItemEntity } from "../entities/food-items.entity";
import { GroupEntity } from "../entities/group.entity";
import { MealEntity } from "../entities/meal.entity";
import { RecipeEntity } from "../entities/recipe.entity";
import { ReportDataEntity } from "../entities/report-data.entity";
import { ShoppingItemEntity } from "../entities/shopping-item.entity";
import { ShoppingListEntity } from "../entities/shopping-list.entity";
import { FoodCategoryModule } from "../modules/food-category/food-category.module";

@Module({
  imports: [
    LoadConfigModule,
    TypeOrmConfigModule,
    JwtConfigModule,
    MailerConfigModule,

    AuthModule,
    UsersModule,
    HealthModule,

    TypeOrmModule.forFeature([
      FavoriteRecipeEntity,
      FoodCategoryEntity,
      FoodItemEntity,
      GroupEntity,
      MealEntity,
      RecipeEntity,
      ReportDataEntity,
      ShoppingItemEntity,
      ShoppingListEntity,
    ]),

    ShoppingListModule,
    MealModule,
    ReportModule,
    SuggestionModule,
    FridgeModule,
    GroupModule,
    FoodCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint],
  exports: [TypeOrmModule],
})
export class AppModule { }
