import { Module } from "@nestjs/common";
import { FridgeController } from "./fridge.controller";
import { FridgeService } from "./fridge.service";
import { DatabaseModule } from "../database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [FridgeController],
  providers: [FridgeService],
})
export class FridgeModule {}
