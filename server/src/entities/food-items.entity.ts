import { Column } from "typeorm";
import { UserBaseEntity } from "../common/entities/user-base-entity";

export class FoodItemEntity extends UserBaseEntity {
  @Column({ nullable: true })
  expirationDate: Date;

  @Column({ nullable: true })
  name: string;
}
