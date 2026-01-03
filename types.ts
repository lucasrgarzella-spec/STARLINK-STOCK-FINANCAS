
export type Category = 'Antena' | 'Cabo' | 'Acessório' | 'Outros';

export interface Product {
  id: string;
  name: string;
  category: Category;
  sku: string;
  purchasePrice: number;
  sellPrice: number;
  stock: number;
  supplier: string;
  entryDate: string;
  images: string[]; // Base64 strings
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  soldPrice: number;
  shippingCost: number; // Novo campo
  total: number;
  profit: number;
  paymentMethod: string;
  customerName?: string;
  date: string;
  proofPhoto?: string;
}

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitValue: number;
  photo?: string;
  date: string;
}

export interface AppState {
  products: Product[];
  sales: Sale[];
  stockLogs: StockLog[];
}
