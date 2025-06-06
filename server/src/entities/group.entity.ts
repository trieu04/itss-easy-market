import { Column, Entity, ManyToOne, ManyToMany, JoinTable, OneToOne, JoinColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { FridgeEntity } from "./fridge.entity";
import { UserBaseEntity } from "../common/entities/user-base-entity";

@Entity("group")
export class GroupEntity extends UserBaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: "CASCADE" })
  owner: UserEntity;

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: "group_members",
    joinColumn: { name: "group_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "user_id", referencedColumnName: "id" },
  })
  members: UserEntity[];

  //fridge 1-1
  @OneToOne(() => FridgeEntity, { cascade: true })
  @JoinColumn()
  fridge: FridgeEntity;
}