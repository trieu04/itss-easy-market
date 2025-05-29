import { TypeOrmCrudService } from "@dataui/crud-typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ShoppingListEntity } from "../../entities/shopping-list.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export interface CreateShoppingListDto {
  name: string;
  items: string[];
  status?: "active" | "completed" | "cancelled";
}

export interface UpdateShoppingListDto {
  name?: string;
  items?: string[];
  status?: "active" | "completed" | "cancelled";
}

@Injectable()
export class ShoppingListService extends TypeOrmCrudService<ShoppingListEntity> {
  constructor(@InjectRepository(ShoppingListEntity) public shoppingListRepo: Repository<ShoppingListEntity>) {
    super(shoppingListRepo);
  }

  async createShoppingList(userId: string, createDto: CreateShoppingListDto): Promise<ShoppingListEntity> {
    const shoppingList = this.shoppingListRepo.create({
      name: createDto.name,
      items: createDto.items,
      status: createDto.status || "active",
      userId,
    });

    return await this.shoppingListRepo.save(shoppingList);
  }

  async getUserShoppingLists(userId: string): Promise<ShoppingListEntity[]> {
    return await this.shoppingListRepo.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
  }

  async getShoppingListById(id: string, userId: string): Promise<ShoppingListEntity> {
    const shoppingList = await this.shoppingListRepo.findOne({
      where: { id, userId },
    });

    if (!shoppingList) {
      throw new NotFoundException("Shopping list not found");
    }

    return shoppingList;
  }

  async updateShoppingList(id: string, userId: string, updateDto: UpdateShoppingListDto): Promise<ShoppingListEntity> {
    const shoppingList = await this.getShoppingListById(id, userId);

    Object.assign(shoppingList, updateDto);

    return await this.shoppingListRepo.save(shoppingList);
  }

  async deleteShoppingList(id: string, userId: string): Promise<void> {
    const shoppingList = await this.getShoppingListById(id, userId);
    await this.shoppingListRepo.remove(shoppingList);
  }

  async getActiveShoppingLists(userId: string): Promise<ShoppingListEntity[]> {
    return await this.shoppingListRepo.find({
      where: { userId, status: "active" },
      order: { createdAt: "DESC" },
    });
  }

  async markAsCompleted(id: string, userId: string): Promise<ShoppingListEntity> {
    return await this.updateShoppingList(id, userId, { status: "completed" });
  }

  async getShoppingListStats(userId: string) {
    const total = await this.shoppingListRepo.count({ where: { userId } });
    const active = await this.shoppingListRepo.count({ where: { userId, status: "active" } });
    const completed = await this.shoppingListRepo.count({ where: { userId, status: "completed" } });

    return {
      total,
      active,
      completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }
}
