import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UserRoleEnum } from "../../entities/user.entity";
import { Roles } from "../auth/decorators/roles.decorator";
import { AuthGuard } from "../auth/guards/auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("suggestion")
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles([UserRoleEnum.USER])
export class SuggestionController {
    @Get("generate-suggestions")
    generateSuggestions() {
        return [];
    }
}
