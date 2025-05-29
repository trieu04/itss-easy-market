import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RecipeEntity } from "../../entities/recipe.entity";

export interface CreateRecipeDto {
  name: string;
  description?: string;
  cookTime: number;
  servings: number;
  image?: string;
  tags?: string[];
  ingredients: { name: string; amount: string; unit: string }[];
  instructions: string[];
  difficulty: "easy" | "medium" | "hard";
}

export interface UpdateRecipeDto {
  name?: string;
  description?: string;
  cookTime?: number;
  servings?: number;
  image?: string;
  tags?: string[];
  ingredients?: { name: string; amount: string; unit: string }[];
  instructions?: string[];
  difficulty?: "easy" | "medium" | "hard";
}

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>,
  ) {}

  async findAll(): Promise<RecipeEntity[]> {
    return this.recipeRepository.find({
      where: { isActive: true },
      order: { createdAt: "DESC" },
    });
  }

  async findAllByUser(userId: string): Promise<RecipeEntity[]> {
    return this.recipeRepository.find({
      where: { userId, isActive: true },
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: string): Promise<RecipeEntity> {
    const recipe = await this.recipeRepository.findOne({
      where: { id, isActive: true },
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    // Increment view count
    recipe.viewCount += 1;
    await this.recipeRepository.save(recipe);

    return recipe;
  }

  async create(createDto: CreateRecipeDto, userId: string): Promise<RecipeEntity> {
    const recipe = this.recipeRepository.create({
      ...createDto,
      userId,
    });

    return this.recipeRepository.save(recipe);
  }

  async update(id: string, updateDto: UpdateRecipeDto, userId: string): Promise<RecipeEntity> {
    const recipe = await this.recipeRepository.findOne({
      where: { id, userId, isActive: true },
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    Object.assign(recipe, updateDto);
    return this.recipeRepository.save(recipe);
  }

  async remove(id: string, userId: string): Promise<void> {
    const recipe = await this.recipeRepository.findOne({
      where: { id, userId, isActive: true },
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    recipe.isActive = false;
    await this.recipeRepository.save(recipe);
  }

  async getPopularRecipes(limit: number = 5): Promise<RecipeEntity[]> {
    return this.recipeRepository.find({
      where: { isActive: true },
      order: { viewCount: "DESC", favoriteCount: "DESC" },
      take: limit,
    });
  }

  async getMostViewed(limit: number = 10): Promise<RecipeEntity[]> {
    return this.recipeRepository.find({
      where: { isActive: true },
      order: { viewCount: "DESC" },
      take: limit,
    });
  }

  async getRecipesByDifficulty(difficulty: "easy" | "medium" | "hard"): Promise<RecipeEntity[]> {
    return this.recipeRepository.find({
      where: { difficulty, isActive: true },
      order: { createdAt: "DESC" },
    });
  }

  async searchRecipes(searchTerm: string): Promise<RecipeEntity[]> {
    return this.recipeRepository
      .createQueryBuilder("recipe")
      .where("recipe.isActive = :isActive", { isActive: true })
      .andWhere(
        "(recipe.name ILIKE :searchTerm OR recipe.description ILIKE :searchTerm OR recipe.tags::text ILIKE :searchTerm)",
        { searchTerm: `%${searchTerm}%` },
      )
      .orderBy("recipe.viewCount", "DESC")
      .getMany();
  }

  async getRecipeStats() {
    try {
      const [total, easy, medium, hard] = await Promise.all([
        this.recipeRepository.count({ where: { isActive: true } }),
        this.recipeRepository.count({ where: { difficulty: "easy", isActive: true } }),
        this.recipeRepository.count({ where: { difficulty: "medium", isActive: true } }),
        this.recipeRepository.count({ where: { difficulty: "hard", isActive: true } }),
      ]);

      let avgCookTime: any = { avg: "0" };
      let avgServings: any = { avg: "0" };

      if (total > 0) {
        try {
          const cookTimeResult = await this.recipeRepository
            .createQueryBuilder("recipe")
            .select("AVG(recipe.cookTime)", "avg")
            .where("recipe.isActive = :isActive", { isActive: true })
            .getRawOne();
          
          if (cookTimeResult && cookTimeResult.avg) {
            avgCookTime = cookTimeResult;
          }

          const servingsResult = await this.recipeRepository
            .createQueryBuilder("recipe")
            .select("AVG(recipe.servings)", "avg")
            .where("recipe.isActive = :isActive", { isActive: true })
            .getRawOne();
          
          if (servingsResult && servingsResult.avg) {
            avgServings = servingsResult;
          }
        } catch (error) {
          console.error("Error calculating recipe averages:", error);
        }
      }

      return {
        total,
        difficultyDistribution: [
          { difficulty: "easy", count: easy, percentage: total > 0 ? (easy / total) * 100 : 0 },
          { difficulty: "medium", count: medium, percentage: total > 0 ? (medium / total) * 100 : 0 },
          { difficulty: "hard", count: hard, percentage: total > 0 ? (hard / total) * 100 : 0 },
        ],
        averageCookTime: Math.round(Number.parseFloat(avgCookTime?.avg || "0") || 0),
        averageServings: Math.round(Number.parseFloat(avgServings?.avg || "0") || 0),
      };
    } catch (error) {
      console.error("Error in getRecipeStats:", error);
      return {
        total: 0,
        difficultyDistribution: [
          { difficulty: "easy", count: 0, percentage: 0 },
          { difficulty: "medium", count: 0, percentage: 0 },
          { difficulty: "hard", count: 0, percentage: 0 },
        ],
        averageCookTime: 0,
        averageServings: 0,
      };
    }
  }

  async incrementFavoriteCount(id: string): Promise<void> {
    await this.recipeRepository.increment({ id }, "favoriteCount", 1);
  }

  async decrementFavoriteCount(id: string): Promise<void> {
    await this.recipeRepository.decrement({ id }, "favoriteCount", 1);
  }
}