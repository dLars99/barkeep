import { Category } from "./categories.model";
import { Ingredient } from "./ingredients.model";

export interface Recipe {
  id?: number;
  name: string;
  instructions?: string;
  rating?: number;
  glass1?: string;
  glass2?: string;
}

export interface RecipeIngredient {
  id?: number;
  recipe_id: number;
  ingredient_id: number;
  quantity: string;
  quantity_type: string;
}

export interface RecipeCreateDTO extends Recipe {
  category_id: number;
  ingredients: RecipeIngredient[];
}

export interface RecipeDTO extends Recipe {
  category_id: number;
  ingredients: Ingredient[];
}

export interface RecipeCardIngredient {
  id: number;
  name: string;
  quantity: number;
  quantity_type: string;
}
export interface RecipeCardDTO extends Recipe {
  category: string;
  ingredients: RecipeCardIngredient[];
  matches?: number;
}

export interface RecipeDatabaseModel extends Recipe {
  categoryName: string;
  ingredientId: number;
  ingredientName: string;
  suggestions: string;
  quantity: number;
  quantity_type: string;
  matches?: number;
}
