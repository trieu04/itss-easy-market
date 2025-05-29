import apiService from './api';

export interface ShoppingListItem {
  id: string;
  name: string;
  completed: boolean;
  quantity?: number;
  category?: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: string[]; // Backend lưu dưới dạng array string
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateShoppingListRequest {
  name: string;
  items: string[];
}

export interface UpdateShoppingListRequest {
  name?: string;
  items?: string[];
}

class ShoppingListService {
  async getShoppingLists(): Promise<ShoppingList[]> {
    return apiService.get<ShoppingList[]>('/shopping-list');
  }

  async getShoppingList(id: string): Promise<ShoppingList> {
    return apiService.get<ShoppingList>(`/shopping-list/${id}`);
  }

  async createShoppingList(data: CreateShoppingListRequest): Promise<ShoppingList> {
    return apiService.post<ShoppingList>('/shopping-list', data);
  }

  async updateShoppingList(id: string, data: UpdateShoppingListRequest): Promise<ShoppingList> {
    return apiService.patch<ShoppingList>(`/shopping-list/${id}`, data);
  }

  async deleteShoppingList(id: string): Promise<void> {
    await apiService.delete(`/shopping-list/${id}`);
  }

  // Helper methods để convert giữa frontend format và backend format
  parseItems(items: string[]): ShoppingListItem[] {
    return items.map((item, index) => {
      try {
        const parsed = JSON.parse(item);
        return {
          id: parsed.id || `item-${index}`,
          name: parsed.name || item,
          completed: parsed.completed || false,
          quantity: parsed.quantity,
          category: parsed.category,
        };
      } catch {
        return {
          id: `item-${index}`,
          name: item,
          completed: false,
        };
      }
    });
  }

  stringifyItems(items: ShoppingListItem[]): string[] {
    return items.map(item => JSON.stringify(item));
  }
}

export const shoppingListService = new ShoppingListService();
export default shoppingListService; 