export interface Plant {
  id: number;
  name: string;
  latinName: string;
  category: 'Indoor' | 'Outdoor' | 'Seeds';
  price: number;
  description: string;
  careInstructions: {
    light: string;
    water: string;
    soil: string;
  };
  image: string;
  isSeasonal: boolean;
  stock: number;
}

export interface CartItem extends Plant {
  quantity: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: { text: string; value: string }[];
}

export interface SuggestedPlant {
  plantName: string;
  reason: string;
}

export interface GardeningTip {
  id: number;
  title: string;
  content: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}
