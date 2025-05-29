import { Column, Entity } from "typeorm";
import { UserBaseEntity } from "../common/entities/user-base-entity";

@Entity("shopping_list")
export class ShoppingListEntity extends UserBaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column("text", { array: true })
  items: string[];

  @Column({ default: "active" })
  status: "active" | "completed" | "cancelled";
}
