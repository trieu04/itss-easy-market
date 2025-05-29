import { Module } from "@nestjs/common";
import { ShoppingListController } from "./shopping-list.controller";
import { ShoppingListService } from "./shopping-list.service";
import { DatabaseModule } from "../database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [ShoppingListController],
  providers: [ShoppingListService],
})
export class ShoppingListModule {}
