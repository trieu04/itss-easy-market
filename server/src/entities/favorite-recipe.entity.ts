import { Column } from "typeorm";
import { UserBaseEntity } from "../common/entities/user-base-entity";

export class FavoriteRecipeEntity extends UserBaseEntity {
  @Column({})
  recipeId: string;
}
