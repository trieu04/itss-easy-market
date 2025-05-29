import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from "@nestjs/common";
import { AppService } from "./app.service";
import { ProductsService } from "../modules/products/products.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(ProductsService) private readonly productsService: ProductsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Recipes endpoints
  @Get("recipes")
  getRecipes() {
    return [];
  }

  @Get("recipes/:id")
  getRecipe(@Param("id") _id: string) {
    return {};
  }

  @Post("recipes")
  createRecipe(@Body() _data: any) {
    return {};
  }

  @Put("recipes/:id")
  updateRecipe(@Param("id") _id: string, @Body() _data: any) {
    return {};
  }

  @Delete("recipes/:id")
  deleteRecipe(@Param("id") _id: string) {
    // return nothing
  }

  // Dashboard endpoints
  @Get("dashboard/stats")
  async getDashboardStats() {
    const products = await this.productsService.findAll();
    const totalProducts = products.length;
    
    return {
      totalProducts,
      totalRecipes: 0,
      totalMealPlans: 0,
      expiringSoonCount: 0,
      totalShoppingLists: 0,
      activeShoppingLists: 0,
      recentActivities: [
        {
          id: "1",
          type: "product_added",
          title: "Thêm sản phẩm mới",
          description: "Apple đã được thêm vào kho",
          timestamp: new Date().toISOString(),
        },
      ],
      lowStockProducts: [],
      popularRecipes: [],
    };
  }

  @Get("dashboard/activities")
  getRecentActivities(@Query("limit") limit?: string) {
    const limitNum = Math.min(Number.parseInt(limit || "10", 10) || 10, 50);

    const activities = [
      {
        id: "1",
        type: "product_added",
        title: "Thêm sản phẩm mới",
        description: "Apple đã được thêm vào kho",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      },
      {
        id: "2",
        type: "shopping_list_created",
        title: "Tạo danh sách mua sắm",
        description: "Danh sách Weekly Groceries đã được tạo",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      },
      {
        id: "3",
        type: "product_purchased",
        title: "Mua sản phẩm",
        description: "Đã mua 2kg Milk từ danh sách",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      },
    ];

    return activities.slice(0, limitNum);
  }

  @Get("dashboard/low-stock")
  async getLowStockProducts(@Query("limit") limit?: string) {
    const limitNum = Math.min(Number.parseInt(limit || "5", 10) || 5, 20);
    const products = await this.productsService.findAll();

    // Filter products with stock < 20 as low stock
    const lowStockProducts = products
      .filter(product => product.stock < 20)
      .map(product => ({
        id: product.id.toString(),
        name: product.name,
        currentStock: product.stock,
        minStock: 20,
        unit: "kg",
      }))
      .slice(0, limitNum);

    return lowStockProducts;
  }

  @Get("dashboard/popular-recipes")
  getPopularRecipes(@Query("limit") limit?: string) {
    const limitNum = Math.min(Number.parseInt(limit || "5", 10) || 5, 20);

    const recipes = [
      {
        id: "1",
        name: "Phở Bò",
        viewCount: 152,
        favoriteCount: 45,
        image: "https://via.placeholder.com/150x150?text=Pho+Bo",
      },
      {
        id: "2",
        name: "Bún Chả",
        viewCount: 98,
        favoriteCount: 32,
        image: "https://via.placeholder.com/150x150?text=Bun+Cha",
      },
      {
        id: "3",
        name: "Gỏi Cuốn",
        viewCount: 76,
        favoriteCount: 28,
        image: "https://via.placeholder.com/150x150?text=Goi+Cuon",
      },
    ];

    return recipes.slice(0, limitNum);
  }

  @Get("dashboard/recent-meals")
  getRecentMeals() {
    return [];
  }

  @Get("dashboard/expiring-items")
  getExpiringItems() {
    return [];
  }

  @Get("dashboard/frequent-items")
  getFrequentItems() {
    return [];
  }

  // Statistics endpoints
  @Get("statistics")
  getStatistics(@Query("start") _start?: string, @Query("end") _end?: string, @Query("period") _period?: string) {
    return {
      overview: {
        totalSpent: 0,
        totalProducts: 0,
        totalRecipes: 0,
        completedShoppingLists: 0,
        averageShoppingListValue: 0,
        topCategories: [],
      },
      productStats: {
        mostPurchased: [],
        categoryDistribution: [],
        priceRanges: [],
        stockLevels: [],
      },
      recipeStats: {
        mostViewed: [],
        difficultyDistribution: [],
        averageCookTime: 0,
        averageServings: 0,
        popularTags: [],
      },
      shoppingStats: {
        completionRate: 0,
        averageItemsPerList: 0,
        monthlyTrends: [],
        frequentlyBoughtTogether: [],
      },
      timeRange: {
        start: "",
        end: "",
        period: "month",
      },
    };
  }

  @Get("statistics/overview")
  getStatisticsOverview(@Query("timeRange") _timeRange?: string) {
    return {
      totalSpent: 0,
      totalSaved: 0,
      mealsCooked: 0,
      wasteReduced: 0,
    };
  }

  @Get("statistics/products")
  getProductStatistics(@Query("start") _start?: string, @Query("end") _end?: string, @Query("period") _period?: string) {
    return {
      mostPurchased: [],
      categoryDistribution: [],
      priceRanges: [],
      stockLevels: [],
    };
  }

  @Get("statistics/recipes")
  getRecipeStatistics(@Query("start") _start?: string, @Query("end") _end?: string, @Query("period") _period?: string) {
    return {
      mostViewed: [],
      difficultyDistribution: [],
      averageCookTime: 0,
      averageServings: 0,
      popularTags: [],
    };
  }

  @Get("statistics/shopping")
  getShoppingStatistics(@Query("start") _start?: string, @Query("end") _end?: string, @Query("period") _period?: string) {
    return {
      completionRate: 0,
      averageItemsPerList: 0,
      monthlyTrends: [],
      frequentlyBoughtTogether: [],
    };
  }

  @Get("statistics/spending")
  getSpendingData(@Query("timeRange") _timeRange?: string) {
    return [];
  }

  @Get("statistics/categories")
  getCategoryData(@Query("timeRange") _timeRange?: string) {
    return [];
  }

  @Get("statistics/trends")
  getTrendsData(@Query("timeRange") _timeRange?: string) {
    return [];
  }

  // Meal planner endpoints
  @Get("meal-plans")
  getMealPlans(@Query("startDate") _startDate?: string, @Query("endDate") _endDate?: string) {
    return [];
  }

  @Get("meal-plans/:id")
  getMealPlan(@Param("id") _id: string) {
    return {};
  }

  @Post("meal-plans")
  createMealPlan(@Body() _data: any) {
    return {};
  }

  @Put("meal-plans/:id")
  updateMealPlan(@Param("id") _id: string, @Body() _data: any) {
    return {};
  }

  @Delete("meal-plans/:id")
  deleteMealPlan(@Param("id") _id: string) {
    // return nothing
  }

  @Get("meal-plans/week/:date")
  getWeekMealPlans(@Param("date") _date: string) {
    return [];
  }

  @Get("meal-plans/date/:date")
  getMealPlanByDate(@Param("date") _date: string) {
    return null;
  }

  @Get("meal-plans/stats")
  getMealPlanStats() {
    return {
      totalPlans: 0,
      completedPlans: 0,
      totalMeals: 0,
      favoriteRecipes: [],
    };
  }

  @Post("meal-plans/generate-shopping-list")
  generateShoppingList(@Body() _data: { mealPlanIds: number[] }) {
    return {};
  }
}
