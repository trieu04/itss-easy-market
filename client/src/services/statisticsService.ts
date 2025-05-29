import apiService from './api';

export interface StatisticsData {
  overview: OverviewStats;
  productStats: ProductStats;
  recipeStats: RecipeStats;
  shoppingStats: ShoppingStats;
  timeRange: TimeRange;
}

export interface OverviewStats {
  totalSpent: number;
  totalProducts: number;
  totalRecipes: number;
  completedShoppingLists: number;
  averageShoppingListValue: number;
  topCategories: CategoryStat[];
}

export interface ProductStats {
  mostPurchased: ProductStat[];
  categoryDistribution: CategoryStat[];
  priceRanges: PriceRangeStat[];
  stockLevels: StockLevelStat[];
}

export interface RecipeStats {
  mostViewed: RecipeStat[];
  difficultyDistribution: DifficultyDistributionStat[];
  averageCookTime: number;
  averageServings: number;
  popularTags: TagStat[];
}

export interface ShoppingStats {
  completionRate: number;
  averageItemsPerList: number;
  monthlyTrends: MonthlyTrendStat[];
  frequentlyBoughtTogether: ProductPairStat[];
}

export interface CategoryStat {
  category: string;
  count: number;
  value: number;
  percentage: number;
}

export interface ProductStat {
  id: string;
  name: string;
  category: string;
  totalQuantity: number;
  totalValue: number;
  averagePrice: number;
}

export interface RecipeStat {
  id: string;
  name: string;
  views: number;
  favorites: number;
  difficulty: string;
  cookTime: number;
}

export interface PriceRangeStat {
  range: string;
  count: number;
  percentage: number;
}

export interface StockLevelStat {
  level: 'high' | 'medium' | 'low' | 'out';
  count: number;
  percentage: number;
}

export interface DifficultyDistributionStat {
  difficulty: 'easy' | 'medium' | 'hard';
  count: number;
  percentage: number;
}

export interface TagStat {
  tag: string;
  count: number;
  percentage: number;
}

export interface MonthlyTrendStat {
  month: string;
  totalLists: number;
  completedLists: number;
  totalValue: number;
  averageValue: number;
}

export interface ProductPairStat {
  product1: string;
  product2: string;
  frequency: number;
  confidence: number;
}

export interface TimeRange {
  start: string;
  end: string;
  period: 'week' | 'month' | 'quarter' | 'year';
}

class StatisticsService {
  async getStatistics(timeRange?: Partial<TimeRange>): Promise<StatisticsData> {
    const params = new URLSearchParams();
    if (timeRange?.start) params.append('start', timeRange.start);
    if (timeRange?.end) params.append('end', timeRange.end);
    if (timeRange?.period) params.append('period', timeRange.period);
    
    return apiService.get<StatisticsData>(`/statistics?${params.toString()}`);
  }

  async getOverviewStats(timeRange?: Partial<TimeRange>): Promise<OverviewStats> {
    const params = new URLSearchParams();
    if (timeRange?.start) params.append('start', timeRange.start);
    if (timeRange?.end) params.append('end', timeRange.end);
    if (timeRange?.period) params.append('period', timeRange.period);
    
    return apiService.get<OverviewStats>(`/statistics/overview?${params.toString()}`);
  }

  async getProductStats(timeRange?: Partial<TimeRange>): Promise<ProductStats> {
    const params = new URLSearchParams();
    if (timeRange?.start) params.append('start', timeRange.start);
    if (timeRange?.end) params.append('end', timeRange.end);
    if (timeRange?.period) params.append('period', timeRange.period);
    
    return apiService.get<ProductStats>(`/statistics/products?${params.toString()}`);
  }

  async getRecipeStats(timeRange?: Partial<TimeRange>): Promise<RecipeStats> {
    const params = new URLSearchParams();
    if (timeRange?.start) params.append('start', timeRange.start);
    if (timeRange?.end) params.append('end', timeRange.end);
    if (timeRange?.period) params.append('period', timeRange.period);
    
    return apiService.get<RecipeStats>(`/statistics/recipes?${params.toString()}`);
  }

  async getShoppingStats(timeRange?: Partial<TimeRange>): Promise<ShoppingStats> {
    const params = new URLSearchParams();
    if (timeRange?.start) params.append('start', timeRange.start);
    if (timeRange?.end) params.append('end', timeRange.end);
    if (timeRange?.period) params.append('period', timeRange.period);
    
    return apiService.get<ShoppingStats>(`/statistics/shopping?${params.toString()}`);
  }
}

export const statisticsService = new StatisticsService();
export default statisticsService; 