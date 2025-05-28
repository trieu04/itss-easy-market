import { Entity } from "typeorm";
import { JsonColumn } from "../common/decorators/json-column.decorator";
import { UserBaseEntity } from "../common/entities/user-base-entity";

@Entity("recipe")
export class RecipeEntity extends UserBaseEntity {
  @JsonColumn({ nullable: true })
  details: string;
}
