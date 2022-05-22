import { Category } from "./categories.model";
import { Ingredient } from "./ingredients.model";

export interface Drink {
  id?: number;
  drink_name: string;
  instructions?: string;
  rating?: number;
  glass1?: string;
  glass2?: string;
  video_url?: string;
}

export interface DrinkIngredient {
  id?: number;
  drink_id: number;
  ingredient_id: number;
  quantity: string;
  quantity_type: string;
}

export interface DrinkCreateDTO extends Drink {
  category_id: number;
  ingredients: DrinkIngredient[];
}

export interface DrinkDTO extends Drink {
  category_id: number;
  ingredients: Ingredient[];
}

export interface DrinkCardIngredient {
  id: number;
  ingredient_name: string;
  quantity: number;
  quantity_type: string;
}
export interface DrinkCardDTO extends Drink {
  category: string;
  ingredients: DrinkCardIngredient[];
  matches?: number;
}

export interface DrinkDatabaseModel extends Drink {
  category_name: string;
  ingredientId: number;
  ingredient_name: string;
  suggestions: string;
  quantity: number;
  quantity_type: string;
  matches?: number;
}
