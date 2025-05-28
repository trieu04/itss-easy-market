import { Column, Entity } from "typeorm";
import { BaseEntity } from "../common/entities/base.entity";

@Entity("food_category")
export class FoodCategoryEntity extends BaseEntity {
  @Column({ nullable: true })
  name: string;
}
