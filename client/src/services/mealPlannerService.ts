import apiService from './api';
import { Recipe } from './recipeService';

export interface MealPlan {
  id: string;
  date: string;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
  snacks?: Recipe[];
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMealPlanRequest {
  date: string;
  breakfast?: string; // Recipe ID
  lunch?: string;     // Recipe ID
  dinner?: string;    // Recipe ID
  snacks?: string[];  // Recipe IDs
  notes?: string;
}

export interface UpdateMealPlanRequest extends Partial<CreateMealPlanRequest> {}

export interface MealPlanWeek {
  startDate: string;
  endDate: string;
  plans: MealPlan[];
}

export interface MealPlanStats {
  totalPlansThisWeek: number;
  totalPlansThisMonth: number;
  favoriteBreakfastRecipe?: Recipe;
  favoriteLunchRecipe?: Recipe;
  favoriteDinnerRecipe?: Recipe;
  averageCookTimePerDay: number;
  upcomingMeals: UpcomingMeal[];
}

export interface UpcomingMeal {
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  recipe: Recipe;
  prepTime: number;
}

class MealPlannerService {
  async getMealPlans(startDate?: string, endDate?: string): Promise<MealPlan[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    return apiService.get<MealPlan[]>(`/meal-plans?${params.toString()}`);
  }

  async getMealPlan(id: string): Promise<MealPlan> {
    return apiService.get<MealPlan>(`/meal-plans/${id}`);
  }

  async getMealPlanByDate(date: string): Promise<MealPlan | null> {
    try {
      return await apiService.get<MealPlan>(`/meal-plans/date/${date}`);
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createMealPlan(data: CreateMealPlanRequest): Promise<MealPlan> {
    return apiService.post<MealPlan>('/meal-plans', data);
  }

  async updateMealPlan(id: string, data: UpdateMealPlanRequest): Promise<MealPlan> {
    return apiService.put<MealPlan>(`/meal-plans/${id}`, data);
  }

  async deleteMealPlan(id: string): Promise<void> {
    return apiService.delete(`/meal-plans/${id}`);
  }

  async getWeekPlans(weekStartDate: string): Promise<MealPlanWeek> {
    return apiService.get<MealPlanWeek>(`/meal-plans/week/${weekStartDate}`);
  }

  async getMealPlanStats(): Promise<MealPlanStats> {
    return apiService.get<MealPlanStats>('/meal-plans/stats');
  }

  async duplicatePlan(fromDate: string, toDate: string): Promise<MealPlan> {
    return apiService.post<MealPlan>('/meal-plans/duplicate', {
      fromDate,
      toDate
    });
  }

  async generateShoppingListFromPlans(startDate: string, endDate: string): Promise<{
    ingredients: Array<{
      name: string;
      amount: string;
      unit: string;
      category: string;
      recipes: string[];
    }>;
  }> {
    return apiService.post('/meal-plans/generate-shopping-list', {
      startDate,
      endDate
    });
  }

  // Utility methods
  getStartOfWeek(date: Date): string {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    start.setDate(diff);
    return start.toISOString().split('T')[0];
  }

  getEndOfWeek(date: Date): string {
    const end = new Date(date);
    const day = end.getDay();
    const diff = end.getDate() - day + (day === 0 ? 0 : 7); // Adjust when day is Sunday
    end.setDate(diff);
    return end.toISOString().split('T')[0];
  }

  getWeekDates(startDate: string): string[] {
    const dates: string[] = [];
    const start = new Date(startDate);
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      dates.push(currentDate.toISOString().split('T')[0]);
    }
    
    return dates;
  }
}

export const mealPlannerService = new MealPlannerService();
export default mealPlannerService; 