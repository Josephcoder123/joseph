export interface Crop {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export const crops: Crop[] = [
  { id: "wheat", name: "Wheat", category: "Cereals", icon: "🌾" },
  { id: "rice", name: "Rice", category: "Cereals", icon: "🌾" },
  { id: "corn", name: "Corn (Maize)", category: "Cereals", icon: "🌽" },
  { id: "barley", name: "Barley", category: "Cereals", icon: "🌾" },
  { id: "sorghum", name: "Sorghum", category: "Cereals", icon: "🌾" },
  { id: "oats", name: "Oats", category: "Cereals", icon: "🌾" },
  { id: "millet", name: "Millet", category: "Cereals", icon: "🌾" },
  
  { id: "potato", name: "Potato", category: "Root Crops", icon: "🥔" },
  { id: "sweet_potato", name: "Sweet Potato", category: "Root Crops", icon: "🍠" },
  { id: "cassava", name: "Cassava", category: "Root Crops", icon: "🥔" },
  { id: "carrot", name: "Carrot", category: "Root Crops", icon: "🥕" },
  
  { id: "soybean", name: "Soybean", category: "Legumes", icon: "🫘" },
  { id: "peanut", name: "Peanut", category: "Legumes", icon: "🥜" },
  { id: "chickpea", name: "Chickpea", category: "Legumes", icon: "🫘" },
  { id: "lentil", name: "Lentil", category: "Legumes", icon: "🫘" },
  { id: "pea", name: "Pea", category: "Legumes", icon: "🫛" },
  
  { id: "tomato", name: "Tomato", category: "Vegetables", icon: "🍅" },
  { id: "onion", name: "Onion", category: "Vegetables", icon: "🧅" },
  { id: "cabbage", name: "Cabbage", category: "Vegetables", icon: "🥬" },
  { id: "lettuce", name: "Lettuce", category: "Vegetables", icon: "🥬" },
  { id: "spinach", name: "Spinach", category: "Vegetables", icon: "🥬" },
  { id: "broccoli", name: "Broccoli", category: "Vegetables", icon: "🥦" },
  { id: "cauliflower", name: "Cauliflower", category: "Vegetables", icon: "🥦" },
  { id: "pepper", name: "Pepper", category: "Vegetables", icon: "🌶️" },
  
  { id: "cotton", name: "Cotton", category: "Industrial", icon: "🌱" },
  { id: "sugarcane", name: "Sugarcane", category: "Industrial", icon: "🎋" },
  { id: "coffee", name: "Coffee", category: "Industrial", icon: "☕" },
  { id: "tea", name: "Tea", category: "Industrial", icon: "🍵" },
  { id: "tobacco", name: "Tobacco", category: "Industrial", icon: "🌿" },
  
  { id: "apple", name: "Apple", category: "Fruits", icon: "🍎" },
  { id: "banana", name: "Banana", category: "Fruits", icon: "🍌" },
  { id: "grape", name: "Grape", category: "Fruits", icon: "🍇" },
  { id: "orange", name: "Orange", category: "Fruits", icon: "🍊" },
];

export const cropCategories = [
  "All",
  "Cereals",
  "Root Crops",
  "Legumes",
  "Vegetables",
  "Industrial",
  "Fruits",
];
