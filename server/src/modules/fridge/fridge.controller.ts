import { Controller, Get, Post, Put, Delete, Body, Param, Query } from "@nestjs/common";

interface FridgeItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  location: string;
  expiryDate: string;
  status: "fresh" | "expiring" | "expired";
  addedDate: string;
}

@Controller("fridge")
export class FridgeController {
  private mockItems: FridgeItem[] = [
    {
      id: "1",
      name: "Milk",
      quantity: 1,
      unit: "liter",
      category: "dairy",
      location: "main_compartment",
      expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "expiring",
      addedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      name: "Apple",
      quantity: 5,
      unit: "pieces",
      category: "fruits",
      location: "crisper",
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "fresh",
      addedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      name: "Bread",
      quantity: 1,
      unit: "loaf",
      category: "bakery",
      location: "main_compartment",
      expiryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: "expired",
      addedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  @Get("items")
  getFridgeItems() {
    return this.mockItems;
  }

  @Get("items/:id")
  getFridgeItem(@Param("id") id: string) {
    const item = this.mockItems.find(item => item.id === id);
    return item || { error: "Item not found" };
  }

  @Post("items")
  addToFridge(@Body() data: Partial<FridgeItem>) {
    const newItem: FridgeItem = {
      id: (this.mockItems.length + 1).toString(),
      name: data.name || "Unknown",
      quantity: data.quantity || 1,
      unit: data.unit || "pieces",
      category: data.category || "other",
      location: data.location || "main_compartment",
      expiryDate: data.expiryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "fresh",
      addedDate: new Date().toISOString(),
    };

    this.mockItems.push(newItem);
    return newItem;
  }

  @Put("items/:id")
  updateFridgeItem(@Param("id") id: string, @Body() data: Partial<FridgeItem>) {
    const itemIndex = this.mockItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return { error: "Item not found" };
    }

    this.mockItems[itemIndex] = { ...this.mockItems[itemIndex], ...data };
    return this.mockItems[itemIndex];
  }

  @Delete("items/:id")
  removeFridgeItem(@Param("id") id: string) {
    const itemIndex = this.mockItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return { error: "Item not found" };
    }

    this.mockItems.splice(itemIndex, 1);
    return { success: true };
  }

  @Get("stats")
  getFridgeStats() {
    const total = this.mockItems.length;
    const expired = this.mockItems.filter(item => item.status === "expired").length;
    const expiringSoon = this.mockItems.filter(item => item.status === "expiring").length;
    const fresh = this.mockItems.filter(item => item.status === "fresh").length;

    const categoryCount = this.mockItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A";

    const lowStockItems = this.mockItems.filter(item => item.quantity < 2);

    return {
      total,
      expired,
      expiringSoon,
      fresh,
      mostCommonCategory,
      lowStockItems: lowStockItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
      })),
    };
  }

  @Get("expiring")
  getExpiringItems(@Query("days") days: string = "3") {
    const daysNum = Number.parseInt(days, 10) || 3;
    const cutoffDate = new Date(Date.now() + daysNum * 24 * 60 * 60 * 1000);

    return this.mockItems.filter(item => {
      const expiryDate = new Date(item.expiryDate);
      return expiryDate <= cutoffDate && expiryDate > new Date();
    });
  }

  @Get("expired")
  getExpiredItems() {
    return this.mockItems.filter(item => item.status === "expired");
  }

  @Post("items/:id/consume")
  consumeItem(@Param("id") id: string, @Body() data: { quantity: number }) {
    const item = this.mockItems.find(item => item.id === id);
    if (!item) {
      return { error: "Item not found" };
    }

    item.quantity = Math.max(0, item.quantity - (data.quantity || 1));

    if (item.quantity === 0) {
      const itemIndex = this.mockItems.findIndex(i => i.id === id);
      this.mockItems.splice(itemIndex, 1);
      return { message: "Item consumed completely and removed" };
    }

    return item;
  }

  @Post("items/:id/move")
  moveItem(@Param("id") id: string, @Body() data: { location: string }) {
    const item = this.mockItems.find(item => item.id === id);
    if (!item) {
      return { error: "Item not found" };
    }

    item.location = data.location;
    return item;
  }

  @Post("add-food")
  addFood(@Body() data: Partial<FridgeItem>) {
    return this.addToFridge(data);
  }

  @Post("remove-food")
  removeFood(@Body() data: { id: string }) {
    return this.removeFridgeItem(data.id);
  }

  @Get("notify-expiration")
  notifyExpiration() {
    const expiring = this.getExpiringItems("2");
    const expired = this.getExpiredItems();

    return {
      expiring: expiring.map(item => ({
        id: item.id,
        name: item.name,
        expiryDate: item.expiryDate,
        daysLeft: Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
      })),
      expired: expired.map(item => ({
        id: item.id,
        name: item.name,
        expiryDate: item.expiryDate,
        daysOverdue: Math.ceil((Date.now() - new Date(item.expiryDate).getTime()) / (24 * 60 * 60 * 1000)),
      })),
    };
  }
}
