import { Entity } from "typeorm";
import { JsonColumn } from "../common/decorators/json-column.decorator";
import { UserBaseEntity } from "../common/entities/user-base-entity";

@Entity("user_data")
export class UserDataEntity extends UserBaseEntity {
  @JsonColumn({})
  data: any;
}
