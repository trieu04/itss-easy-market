import { Controller, Get, Post } from "@nestjs/common";

@Controller("fridge")
export class FridgeController {
  @Get()
  getFridge() {
    return [];
  }

  @Post("add-food")
  addFood() {
    return true;
  }

  @Post("remove-food")
  removeFood() {
    return true;
  }

  @Get("notify-expiration")
  notifyExpiration() {
    return [];
  }
}
