import { Ingredient } from "./ingredients.model";

export interface Recipe {
    id?: number;
    name: string;
    instructions?: string;
    category_id: number;
    rating?: number;
    glass1?: string;
    glass2?: string;
}

export interface RecipeIngredient {
    recipe_id: number;
    ingredient_id: number;
    quantity: string;
}
export interface RecipeCreateDTO extends Recipe {
    ingredients: RecipeIngredient[];
}