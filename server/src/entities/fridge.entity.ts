import { Column, Entity } from "typeorm";
import { UserBaseEntity } from "../common/entities/user-base-entity";

@Entity("fridge")
export class FridgeEntity extends UserBaseEntity {
  
}