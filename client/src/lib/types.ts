export interface MenuItem {
  id: number;
  restaurantId: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  prepTime: number;
  totalRating: number;
  totalReviews: number;
  imageUrl?: string;
}