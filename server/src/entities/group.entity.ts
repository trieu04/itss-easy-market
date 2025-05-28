import { Column, Entity } from "typeorm";
import { UserBaseEntity } from "../common/entities/user-base-entity";

@Entity("group")
export class GroupEntity extends UserBaseEntity {
  @Column("text", { nullable: true, array: true })
  members: string[];
}
