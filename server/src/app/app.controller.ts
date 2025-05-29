import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from "@nestjs/common";
import { AppService } from "./app.service";
import { ProductsService } from "../modules/products/products.service";
import { ShoppingListService } from "../modules/shopping-list/shopping-list.service";
import { FridgeService } from "../modules/fridge/fridge.service";
import { RecipeService } from "../modules/recipe/recipe.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(ProductsService) private readonly productsService: ProductsService,
    @Inject(ShoppingListService) private readonly shoppingListService: ShoppingListService,
    @Inject(FridgeService) private readonly fridgeService: FridgeService,
    @Inject(RecipeService) private readonly recipeService: RecipeService,
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
  async getStatistics(@Query("start") _start?: string, @Query("end") _end?: string, @Query("period") _period?: string) {
    try {
      let products: any[] = [];
      let shoppingLists: any[] = [];
      let _fridgeItems: any[] = [];
      let recipes: any[] = [];

      try {
        [products, shoppingLists, _fridgeItems, recipes] = await Promise.all([
          this.productsService.findAll(),
          this.shoppingListService.getUserShoppingLists("00000000-0000-0000-0000-000000000000"), // Sử dụng UUID hợp lệ
          this.fridgeService.findAll("00000000-0000-0000-0000-000000000000"), // Sử dụng UUID hợp lệ
          this.recipeService.findAll(),
        ]);
      } catch (error) {
        console.error("Error fetching data for statistics:", error);
      }

      // Đảm bảo mỗi mảng đều có giá trị hợp lệ
      products = Array.isArray(products) ? products : [];
      shoppingLists = Array.isArray(shoppingLists) ? shoppingLists : [];
      _fridgeItems = Array.isArray(_fridgeItems) ? _fridgeItems : [];
      recipes = Array.isArray(recipes) ? recipes : [];

      // Calculate overview stats
      const totalProducts = products.length;
      const totalRecipes = recipes.length;
      const totalShoppingLists = shoppingLists.length;
      const completedShoppingLists = shoppingLists.filter(list => (list as any)?.status === "completed").length;
      const totalSpent = products.reduce((sum, product) => sum + (product.price * (product.stock || 1)), 0);
      const averageShoppingListValue = totalShoppingLists > 0 ? totalSpent / totalShoppingLists : 0;

      // Calculate category distribution
      const categoryStats: Record<string, { count: number; value: number }> = {};
      products.forEach((product) => {
        if (!categoryStats[product.category]) {
          categoryStats[product.category] = { count: 0, value: 0 };
        }
        categoryStats[product.category].count += 1;
        categoryStats[product.category].value += product.price * (product.stock || 1);
      });

      const topCategories = Object.entries(categoryStats)
        .map(([category, stats]) => ({
          category,
          count: stats.count,
          value: stats.value,
          percentage: totalSpent > 0 ? (stats.value / totalSpent) * 100 : 0,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      // Product statistics
      const mostPurchased = products
        .sort((a, b) => (b.stock || 0) - (a.stock || 0))
        .slice(0, 10)
        .map(product => ({
          id: product.id?.toString() || "",
          name: product.name || "Không tên",
          category: product.category || "Khác",
          totalQuantity: product.stock || 0,
          totalValue: product.price * (product.stock || 1),
          averagePrice: product.price || 0,
        }));

      const priceRanges = [
        { range: "0-50k", count: products.filter(p => (p.price || 0) < 50000).length },
        { range: "50k-100k", count: products.filter(p => (p.price || 0) >= 50000 && (p.price || 0) < 100000).length },
        { range: "100k-200k", count: products.filter(p => (p.price || 0) >= 100000 && (p.price || 0) < 200000).length },
        { range: "200k+", count: products.filter(p => (p.price || 0) >= 200000).length },
      ];

      const stockLevels = [
        { level: "Hết hàng", count: products.filter(p => (p.stock || 0) === 0).length },
        { level: "Ít hàng", count: products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 10).length },
        { level: "Trung bình", count: products.filter(p => (p.stock || 0) >= 10 && (p.stock || 0) < 50).length },
        { level: "Nhiều hàng", count: products.filter(p => (p.stock || 0) >= 50).length },
      ];

      // Recipe statistics from real data
      let recipeStats = { 
        total: 0,
        difficultyDistribution: [
          { difficulty: "easy", count: 0, percentage: 0 },
          { difficulty: "medium", count: 0, percentage: 0 },
          { difficulty: "hard", count: 0, percentage: 0 },
        ],
        averageCookTime: 0,
        averageServings: 0
      };
      
      let mostViewedRecipes: any[] = [];
      
      try {
        recipeStats = await this.recipeService.getRecipeStats();
        mostViewedRecipes = await this.recipeService.getMostViewed(5);
        
        // Tính phần trăm cho difficultyDistribution nếu chưa có
        if (recipeStats.total > 0) {
          recipeStats.difficultyDistribution = recipeStats.difficultyDistribution.map(item => ({
            ...item,
            percentage: item.percentage !== undefined ? item.percentage : (item.count / recipeStats.total) * 100
          }));
        }
      } catch (error) {
        console.error("Error fetching recipe statistics:", error);
      }

      // Shopping statistics
      const completionRate = totalShoppingLists > 0 ? (completedShoppingLists / totalShoppingLists) * 100 : 0;
      const averageItemsPerList = shoppingLists.length > 0
        ? shoppingLists.reduce((sum, list) => sum + ((list.items?.length) || 0), 0) / shoppingLists.length
        : 0;

      // Tính phần trăm cho priceRanges và stockLevels
      const totalPriceRangeCount = priceRanges.reduce((sum, range) => sum + range.count, 0);
      const priceRangesWithPercentage = priceRanges.map(range => ({
        ...range,
        percentage: totalPriceRangeCount > 0 ? (range.count / totalPriceRangeCount) * 100 : 0
      }));

      const totalStockLevelCount = stockLevels.reduce((sum, level) => sum + level.count, 0);
      const stockLevelsWithPercentage = stockLevels.map(level => ({
        level: level.level === "Hết hàng" ? "out" : 
               level.level === "Ít hàng" ? "low" : 
               level.level === "Trung bình" ? "medium" : "high",
        count: level.count,
        percentage: totalStockLevelCount > 0 ? (level.count / totalStockLevelCount) * 100 : 0
      }));

      return {
        overview: {
          totalSpent,
          totalProducts,
          totalRecipes,
          completedShoppingLists,
          averageShoppingListValue,
          topCategories,
        },
        productStats: {
          mostPurchased,
          categoryDistribution: topCategories,
          priceRanges: priceRangesWithPercentage,
          stockLevels: stockLevelsWithPercentage,
        },
        recipeStats: {
          mostViewed: mostViewedRecipes,
          difficultyDistribution: recipeStats.difficultyDistribution,
          averageCookTime: recipeStats.averageCookTime,
          averageServings: recipeStats.averageServings,
          popularTags: [],
        },
        shoppingStats: {
          completionRate,
          averageItemsPerList,
          monthlyTrends: [],
          frequentlyBoughtTogether: [],
        },
        timeRange: {
          start: "",
          end: "",
          period: "month",
        },
      };
    } catch (error) {
      console.error("Error fetching statistics:", error);
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
