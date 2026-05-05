export interface Category {
  id: number;
  name: string;
}

export interface Mate {
  id: number;
  name: string;
  categories: Category;
  price: number;
  stock: number;
  stockMin: number;
  cost: number;

  // todo lo de abajo con ? se maneja con el frontend (visual)
  image?: string;
  sales?: number;
  images?: Record<string, string>; // ejemplo: { negro: "negro.png", rojo: "rojo.png" }
}

export type StockMovementType = "entrada" | "salida" | "ajuste" | "venta";

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  timestamp: Date;
}
