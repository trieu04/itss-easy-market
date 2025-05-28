import { Column, OneToOne, JoinColumn } from "typeorm";
import { UserEntity } from "../../entities/user.entity";
import { BaseEntity } from "./base.entity";

export class UserBaseEntity extends BaseEntity {
  @Column()
  userId: string;

  @OneToOne(() => UserEntity, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn()
  user: UserEntity;
}
