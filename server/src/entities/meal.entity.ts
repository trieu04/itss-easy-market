import { Column, Entity } from "typeorm";
import { UserBaseEntity } from "../common/entities/user-base-entity";

@Entity("meal")
export class MealEntity extends UserBaseEntity {
  @Column("text", { nullable: true, array: true })
  recipes: string[];
}
