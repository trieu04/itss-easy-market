import { Crud, CrudController } from "@dataui/crud";
import { Controller, UseGuards } from "@nestjs/common";
import { ShoppingListEntity } from "../../entities/shopping-list.entity";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { UserRoleEnum } from "../../entities/user.entity";
import { Roles } from "../auth/decorators/roles.decorator";
import { AuthGuard } from "../auth/guards/auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { ShoppingListService } from "./shopping-list.service";

@Controller("shopping-list")
@ApiTags("shopping-list")
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles([UserRoleEnum.USER])
@Crud({
  model: {
    type: ShoppingListEntity,
  },
  routes: {
    only: ["getManyBase", "getOneBase", "createOneBase", "updateOneBase", "deleteOneBase"],
  },
  query: {
    join: {
      user: {
        eager: true,
      },
    },
  },
})
export class ShoppingListController implements CrudController<ShoppingListEntity> {
  constructor(public service: ShoppingListService) {}
}
