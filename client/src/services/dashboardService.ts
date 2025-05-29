import apiService from './api';

export interface DashboardStats {
  totalProducts: number;
  totalRecipes: number;
  totalMealPlans?: number;
  expiringSoonCount?: number;
  totalShoppingLists?: number;
  activeShoppingLists?: number;
  recentActivities?: Activity[];
  lowStockProducts?: LowStockProduct[];
  popularRecipes?: PopularRecipe[];
}

export interface Activity {
  id: string;
  type: 'product_added' | 'recipe_created' | 'shopping_list_created' | 'product_purchased';
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  unit: string;
}

export interface PopularRecipe {
  id: string;
  name: string;
  viewCount: number;
  favoriteCount: number;
  image: string;
}

class DashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    return apiService.get<DashboardStats>('/dashboard/stats');
  }

  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    return apiService.get<Activity[]>(`/dashboard/activities?limit=${limit}`);
  }

  async getLowStockProducts(limit: number = 5): Promise<LowStockProduct[]> {
    return apiService.get<LowStockProduct[]>(`/dashboard/low-stock?limit=${limit}`);
  }

  async getPopularRecipes(limit: number = 5): Promise<PopularRecipe[]> {
    return apiService.get<PopularRecipe[]>(`/dashboard/popular-recipes?limit=${limit}`);
  }
}

export const dashboardService = new DashboardService();
export default dashboardService; 