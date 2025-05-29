import apiService from './api';
import { Product } from './productService';

export interface FridgeItem extends Product {
  location: 'fridge' | 'freezer' | 'pantry';
  expiryDate: string;
  addedDate: string;
  quantity: number;
}

export interface CreateFridgeItemRequest {
  productId: string;
  location: 'fridge' | 'freezer' | 'pantry';
  expiryDate: string;
  quantity: number;
}

export interface UpdateFridgeItemRequest extends Partial<CreateFridgeItemRequest> {}

export interface FridgeStats {
  total: number;
  expired: number;
  expiringSoon: number;
  fresh: number;
  mostCommonCategory: string;
  lowStockItems: FridgeItem[];
}

class FridgeService {
  async getFridgeItems(): Promise<FridgeItem[]> {
    return apiService.get<FridgeItem[]>('/fridge/items');
  }

  async getFridgeItem(id: string): Promise<FridgeItem> {
    return apiService.get<FridgeItem>(`/fridge/items/${id}`);
  }

  async addToFridge(data: CreateFridgeItemRequest): Promise<FridgeItem> {
    return apiService.post<FridgeItem>('/fridge/items', data);
  }

  async updateFridgeItem(id: string, data: UpdateFridgeItemRequest): Promise<FridgeItem> {
    return apiService.put<FridgeItem>(`/fridge/items/${id}`, data);
  }

  async removeFridgeItem(id: string): Promise<void> {
    return apiService.delete(`/fridge/items/${id}`);
  }

  async getFridgeStats(): Promise<FridgeStats> {
    return apiService.get<FridgeStats>('/fridge/stats');
  }

  async getExpiringItems(days: number = 3): Promise<FridgeItem[]> {
    return apiService.get<FridgeItem[]>(`/fridge/expiring?days=${days}`);
  }

  async getExpiredItems(): Promise<FridgeItem[]> {
    return apiService.get<FridgeItem[]>('/fridge/expired');
  }

  async consumeItem(id: string, quantity: number): Promise<FridgeItem> {
    return apiService.post<FridgeItem>(`/fridge/items/${id}/consume`, { quantity });
  }

  async moveItem(id: string, newLocation: 'fridge' | 'freezer' | 'pantry'): Promise<FridgeItem> {
    return apiService.post<FridgeItem>(`/fridge/items/${id}/move`, { location: newLocation });
  }
}

export const fridgeService = new FridgeService();
export default fridgeService; 