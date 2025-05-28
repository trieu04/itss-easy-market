import { Crud, CrudController } from "@dataui/crud";
import { Controller, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { GroupEntity } from "../../entities/group.entity";
import { UserRoleEnum } from "../../entities/user.entity";
import { Roles } from "../auth/decorators/roles.decorator";
import { AuthGuard } from "../auth/guards/auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { GroupService } from "./group.service";

@Controller("group")
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles([UserRoleEnum.USER])
@Crud({
  model: {
    type: GroupEntity,
  },
    routes: {
        only: ["getManyBase", "getOneBase", "createOneBase", "updateOneBase", "deleteOneBase"],
    },
})
export class GroupController implements CrudController<GroupEntity>{
    constructor(public service: GroupService) {}
}
