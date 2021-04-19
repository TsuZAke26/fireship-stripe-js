export interface InventoryItem {
  id: number;
  active: boolean;
  name: string;
  description?: string;
  images: string[];
  shippable: boolean;
  statement_descriptor: string;
  unit_label?: string;
  metadata: Record<string, string>;
  quantity: number;
  amount: number;
  currency: string;
}
