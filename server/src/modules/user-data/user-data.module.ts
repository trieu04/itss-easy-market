import { Module } from "@nestjs/common";
import { UserDataController } from "./user-data.controller";
import { UserDataService } from "./user-data.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserDataEntity } from "../../entities/user-data.entity";
import { UserEntity } from "../../entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserDataEntity]),
  ],
  controllers: [UserDataController],
  providers: [UserDataService],
})
export class UserDataModule {}
