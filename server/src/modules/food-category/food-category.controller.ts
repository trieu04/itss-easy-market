import { Crud, CrudController } from '@dataui/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FoodCategoryEntity } from '../../entities/food-category.entity';
import { UserRoleEnum } from '../../entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FoodCategoryService } from './food-category.service';

@Controller('food-category')
@ApiTags("food-category")
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles([UserRoleEnum.USER])
@Crud({
  model: {
    type: FoodCategoryService,
  },
    routes: {
        only: ["getManyBase", "getOneBase", "createOneBase", "updateOneBase", "deleteOneBase"],
    },
})
export class FoodCategoryController implements CrudController<FoodCategoryEntity> {
    constructor(public service: FoodCategoryService) {}
}
