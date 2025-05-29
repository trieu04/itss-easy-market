import { TypeOrmCrudService } from "@dataui/crud-typeorm";
import { Injectable } from "@nestjs/common";
import { ShoppingListEntity } from "../../entities/shopping-list.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ShoppingListService extends TypeOrmCrudService<ShoppingListEntity> {
  constructor(@InjectRepository(ShoppingListEntity) public shoppingListRepo: Repository<ShoppingListEntity>) {
    super(shoppingListRepo);
  }
}
