import { useState } from "react";
import { Link } from "react-router";
import {
  Mate,
  StockMovement,
  StockMovementType,
} from "../components/utils/types";

import { Dashboard } from "../components/Dashboard";
import { AddProductForm } from "../components/AddProductForm";
import { ProductList } from "../components/ProductList";
import { StockHistoryView } from "../components/StockHistoryView";
import { StockMovementForm } from "../components/StockMovementForm";
import { ProductGallery } from "./GalleryPage";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import { Eye, Lock, History } from "lucide-react";

interface AdminPageProps {
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

export function AdminPage({
  products,
  onAdd,
  onUpdate,
  onDelete,
  stockMovements,
  recordStockMovement,
  deleteStockMovement,
  updateStockMovement,
}: AdminPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState<"productos" | "historial">(
    "productos",
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === "admin123") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Contraseña incorrecta");
      setPassword("");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="bg-white p-10 rounded-xl shadow-xl space-y-4"
        >
          <h2 className="text-xl font-bold">Panel Admin</h2>

          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500">{error}</p>}

          <Button type="submit">Ingresar</Button>
        </form>
      </div>
    );
  }

  const totalProducts = products.length;

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  const lowStock = products.filter((p) => p.stock <= p.stockMin).length;

  const handleSelectProduct = (product: Mate, color: string | null) => {
    console.log(product.name, color);
  };

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <div className="bg-[#2C5530] text-white p-4 flex justify-between">
        <h1>Panel Admin</h1>

        <div className="flex gap-3">
          <Link to="/">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Ver tienda
            </Button>
          </Link>

          <Button onClick={() => setIsAuthenticated(false)} variant="outline">
            Cerrar sesión
          </Button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-4 border-b p-4">
        <button
          onClick={() => setActiveTab("productos")}
          className={activeTab === "productos" ? "font-bold" : ""}
        >
          Productos
        </button>

        <button
          onClick={() => setActiveTab("historial")}
          className={activeTab === "historial" ? "font-bold" : ""}
        >
          Historial
        </button>
      </div>

      {activeTab === "productos" ? (
        <>
          <Dashboard
            totalProducts={totalProducts}
            totalStock={totalStock}
            lowStock={lowStock}
          />

          <ProductGallery
            products={products}
            onSelectProduct={handleSelectProduct}
            showFooter={false}
            showHeader={false}
          />

          <AddProductForm onAdd={onAdd} />

          <ProductList
            products={products}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </>
      ) : (
        <>
          <StockMovementForm
            products={products}
            onRecordMovement={recordStockMovement}
          />

          <StockHistoryView
            movements={stockMovements}
            onDelete={deleteStockMovement}
            onUpdate={updateStockMovement}
          />
        </>
      )}
    </div>
  );
}
