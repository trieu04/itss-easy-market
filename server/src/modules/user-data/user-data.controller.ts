import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { UserRoleEnum } from "../../entities/user.entity";
import { GetUserId } from "../auth/decorators/get-user-id.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { AuthGuard } from "../auth/guards/auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserDataService } from "./user-data.service";

@Controller("user-data")
export class UserDataController {
  constructor(private readonly service: UserDataService) { }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([UserRoleEnum.USER])
  getUserData(@GetUserId() userId: string) {
    return this.service.getUserData(userId);
  }

  @Post()
  @ApiBody({ schema: { type: "object" } })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([UserRoleEnum.USER])
  updateUserData(@GetUserId() userId: string, @Body() body: any) {
    return this.service.updateUserData(userId, body);
  }

  @Get(":id")
  getUserDataId(@Param("id") id: string) {
    return this.service.getUserData(id);
  }

  @Post(":id")
  @ApiBody({ schema: { type: "object" } })
  updateUserDataId(@Param("id") id: string, @Body() body: any) {
    return this.service.updateUserData(id, body);
  }
}
