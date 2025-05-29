import { TypeOrmCrudService } from "@dataui/crud-typeorm";
import { Injectable } from "@nestjs/common";
import { GroupEntity } from "../../entities/group.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class GroupService extends TypeOrmCrudService<GroupEntity> {
  constructor(@InjectRepository(GroupEntity) public groupRepo: Repository<GroupEntity>) {
    super(groupRepo);
  }
}
