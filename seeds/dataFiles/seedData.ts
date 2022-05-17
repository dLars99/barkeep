export const categories = [
  {
    category_name: "Classic",
  },
  {
    category_name: "Tiki",
  },
  {
    category_name: "Spirit-forward",
  },
  {
    category_name: "Highball",
  },
  {
    category_name: "Duo",
  },
  {
    category_name: "Trio",
  },
  {
    category_name: "Flip",
  },
  {
    category_name: "Champagne Cocktail",
  },
  {
    category_name: "Punch",
  },
  {
    category_name: "Other",
  },
];
export const ingredient_types = [
  {
    ingredient_type_name: "Rum",
  },
  {
    ingredient_type_name: "Whiskey",
  },
  {
    ingredient_type_name: "Gin",
  },
  {
    ingredient_type_name: "Tequila",
  },
  {
    ingredient_type_name: "Vodka",
  },
  {
    ingredient_type_name: "Brandy",
  },
  {
    ingredient_type_name: "Liqueur",
  },
  {
    ingredient_type_name: "Wine",
  },
  {
    ingredient_type_name: "Beer",
  },
  {
    ingredient_type_name: "Mixer",
  },
  {
    ingredient_type_name: "Bitters",
  },
];
export const ingredients = [
  {
    ingredient_name: "Dark rum",
    ingredient_type_id: 1,
    suggestions: "Don Papa",
  },
  {
    ingredient_name: "Angostura bitters",
    ingredient_type_id: 10,
    suggestions: "",
  },
  {
    ingredient_name: "Bourbon",
    ingredient_type_id: 2,
    suggestions: "Four Roses",
  },
  {
    ingredient_name: "Gin",
    ingredient_type_id: 3,
    suggestions: "Beefeater",
  },
  {
    ingredient_name: "Sweet vermouth",
    ingredient_type_id: 8,
    suggestions: "Cocchi Vermouth di Torino",
  },
  {
    ingredient_name: "White semi-dry vermouth",
    ingredient_type_id: 8,
    suggestions: "Dolin Blanc Vermouth de Chambery",
  },
  {
    ingredient_name: "Orange bitters",
    ingredient_type_id: 10,
    suggestions: "",
  },
  {
    ingredient_name: "Lime juice",
    ingredient_type_id: 10,
    suggestions: "Fresh-squeezed from limes",
  },
  {
    ingredient_name: "Grapefruit juice",
    ingredient_type_id: 10,
    suggestions: "Fresh-squeezed from white grapefruit",
  },
  {
    ingredient_name: "Simple syrup",
    ingredient_type_id: 10,
    suggestions: "Homemade 1:1 sugar and water",
  },
  {
    ingredient_name: "Rich demerara syrup",
    ingredient_type_id: 10,
    suggestions: "Homemade 2:1 demerara sugar and water",
  },
  {
    ingredient_name: "Allspice dram",
    ingredient_type_id: 7,
    suggestions: "Homemade 2:1 demerara sugar and water",
  },
  {
    ingredient_name: "Demerara rum",
    ingredient_type_id: 7,
    suggestions: "Hamilton's 76",
  },
  {
    ingredient_name: "Ginger beer",
    ingredient_type_id: 1,
    suggestions: "",
  },
];
export const drinks = [
  {
    drink_name: "Manhattan",
    category_id: 1,
    instructions:
      "Combine in a shaker and shake. Strain into glass. Garnish with a maraschino cherry.",
    glass1: "Chilled coupe",
    glass2: "",
  },
  {
    drink_name: "Martini",
    category_id: 1,
    instructions:
      "Combine ingredients and stir. Strain into glass. Garnish with two olives.",
    glass1: "Chilled coupe",
    glass2: "",
  },
  {
    drink_name: "Lion's Tail",
    category_id: 2,
    instructions:
      "Combine in a shaker and shake. Double strain into glass. Garnish with lemon peel twist.",
    glass1: "Chilled coupe",
    glass2: "Nick & Nora",
  },
  {
    drink_name: "Rum Buck",
    category_id: 2,
    instructions:
      "Combine everything except the ginger beer in a shaker and shake. Strain into glass and top with ginger beer and ice. Garnish with a lime wedge.",
    glass1: "Highball",
    glass2: "",
  },
];
export const drink_ingredients = [
  {
    drink_id: 1,
    ingredient_id: 3,
    quantity: 2,
    quantity_type: "ounce",
  },
  {
    drink_id: 1,
    ingredient_id: 5,
    quantity: 1,
    quantity_type: "ounce",
  },
  {
    drink_id: 1,
    ingredient_id: 2,
    quantity: 2,
    quantity_type: "dash",
  },
  {
    drink_id: 2,
    ingredient_id: 4,
    quantity: 2,
    quantity_type: "ounces",
  },
  {
    drink_id: 2,
    ingredient_id: 6,
    quantity: 1,
    quantity_type: "ounce",
  },
  {
    drink_id: 2,
    ingredient_id: 7,
    quantity: 2,
    quantity_type: "dash",
  },
  {
    drink_id: 3,
    ingredient_id: 3,
    quantity: 1.5,
    quantity_type: "ounce",
  },
  {
    drink_id: 3,
    ingredient_id: 12,
    quantity: 0.5,
    quantity_type: "ounce",
  },
  {
    drink_id: 3,
    ingredient_id: 11,
    quantity: 0.25,
    quantity_type: "ounce",
  },
  {
    drink_id: 3,
    ingredient_id: 8,
    quantity: 0.75,
    quantity_type: "ounce",
  },
  {
    drink_id: 3,
    ingredient_id: 2,
    quantity: 2,
    quantity_type: "dash",
  },
  {
    drink_id: 4,
    ingredient_id: 13,
    quantity: 1.5,
    quantity_type: "ounce",
  },
  {
    drink_id: 4,
    ingredient_id: 12,
    quantity: 0.5,
    quantity_type: "ounce",
  },
  {
    drink_id: 4,
    ingredient_id: 8,
    quantity: 5,
    quantity_type: "ounce",
  },
  {
    drink_id: 4,
    ingredient_id: 14,
    quantity: 4,
    quantity_type: "ounce",
  },
];
