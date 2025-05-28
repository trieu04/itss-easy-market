import { Column, Entity } from "typeorm";
import { UserBaseEntity } from "../common/entities/user-base-entity";

@Entity("shopping_item")
export class ShoppingItemEntity extends UserBaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  unit: string;
}
