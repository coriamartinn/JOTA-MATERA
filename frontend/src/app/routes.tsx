import { createBrowserRouter } from "react-router";
import { ProductGallery } from "./pages/GalleryPage";
import { AdminPage } from "./pages/AdminPage";
import {
  Mate,
  StockMovement,
  StockMovementType,
} from "./components/utils/types";

interface RouterProps {
  products: Mate[];
  onAdd: (product: Omit<Mate, "id">) => void;
  onUpdate: (id: number | string, updates: Partial<Mate>) => void;
  onDelete: (id: number | string) => void;
  stockMovements: StockMovement[];
  recordStockMovement: (
    productId: string | number,
    productName: string,
    type: StockMovementType,
    quantity: number,
    previousStock: number,
    newStock: number,
    reason?: string,
  ) => void;
  deleteStockMovement: (movementId: string) => void;
  updateStockMovement: (
    movementId: string,
    updates: Partial<StockMovement>,
  ) => void;
}

export function createAppRouter({
  products,
  onAdd,
  onUpdate,
  onDelete,
  stockMovements,
  recordStockMovement,
  deleteStockMovement,
  updateStockMovement,
}: RouterProps) {
  const handleSelectProduct = (product: Mate, selectedColor: string | null) => {
    const colorInfo = selectedColor ? ` - Color: ${selectedColor}` : "";
    const message = encodeURIComponent(
      `Hola! Me interesa consultar sobre: ${product.name}${colorInfo}`,
    );
    window.open(`https://wa.me/5491141466547?text=${message}`, "_blank");
  };

  return createBrowserRouter([
    {
      path: "/",
      element: (
        <ProductGallery
          products={products}
          onSelectProduct={handleSelectProduct}
        />
      ),
    },
    {
      path: "/admin",
      element: (
        <AdminPage
          products={products}
          onAdd={onAdd}
          onUpdate={onUpdate}
          onDelete={onDelete}
          stockMovements={stockMovements}
          recordStockMovement={recordStockMovement}
          deleteStockMovement={deleteStockMovement}
          updateStockMovement={updateStockMovement}
        />
      ),
    },
    {
      path: "*",
      element: (
        <div className="min-h-screen bg-gradient-to-br from-[#FFE89D]/20 to-[#F5D76E]/30 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-6xl text-[#2C5530] mb-4">404</h1>
            <p className="text-2xl text-gray-700 mb-8">Página no encontrada</p>
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-[#2C5530] to-[#1E4620] text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      ),
    },
  ]);
}
