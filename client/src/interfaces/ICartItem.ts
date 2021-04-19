export interface CartItem {
  id: number;
  name: string;
  description?: string;
  images: string[];
  amount: number;
  currency: string;
  quantity: number;
}
