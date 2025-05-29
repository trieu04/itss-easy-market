import apiService from './api';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  cookTime: number;
  servings: number;
  image: string;
  tags: string[];
  ingredients: { name: string; amount: string; unit: string }[];
  instructions: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface CreateRecipeRequest {
  name: string;
  description: string;
  cookTime: number;
  servings: number;
  image?: string;
  tags: string[];
  ingredients: { name: string; amount: string; unit: string }[];
  instructions: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

class RecipeService {
  async getRecipes(): Promise<Recipe[]> {
    return apiService.get<Recipe[]>('/recipes');
  }

  async getRecipe(id: string): Promise<Recipe> {
    return apiService.get<Recipe>(`/recipes/${id}`);
  }

  async createRecipe(data: CreateRecipeRequest): Promise<Recipe> {
    return apiService.post<Recipe>('/recipes', data);
  }

  async updateRecipe(id: string, data: Partial<CreateRecipeRequest>): Promise<Recipe> {
    return apiService.patch<Recipe>(`/recipes/${id}`, data);
  }

  async deleteRecipe(id: string): Promise<void> {
    await apiService.delete(`/recipes/${id}`);
  }
}

export const recipeService = new RecipeService();
export default recipeService; 