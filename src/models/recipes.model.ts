export interface Recipe {
    id?: number;
    name: string;
    instructions?: string;
    category_id: number;
    rating?: number;
    glass1?: string;
    glass2?: string;
}