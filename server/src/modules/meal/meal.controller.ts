import { Crud, CrudController } from "@dataui/crud";
import { Controller, UseGuards } from "@nestjs/common";
import { MealEntity } from "../../entities/meal.entity";
import { MealService } from "./meal.service";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { UserRoleEnum } from "../../entities/user.entity";
import { Roles } from "../auth/decorators/roles.decorator";
import { AuthGuard } from "../auth/guards/auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("meal")
@ApiTags("meal")
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles([UserRoleEnum.USER])
@Crud({
  model: {
    type: MealEntity,
  },
  routes: {
    only: ["getManyBase", "getOneBase", "createOneBase", "updateOneBase", "deleteOneBase"],
  },
})
export class MealController implements CrudController<MealEntity> {
  constructor(public service: MealService) {}
}
