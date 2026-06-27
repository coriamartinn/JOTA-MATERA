import { useEffect, useState } from "react";
import { Link } from "react-router";

const API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_REST_URL ||
  "https://jota-matera.onrender.com";
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState<"productos" | "historial">(
    "productos",
  );

  useEffect(() => {
    const storedToken = window.localStorage.getItem("adminToken");

    if (!storedToken) {
      return;
    }

    const verifySession = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/admin/verify`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.ok) {
          setIsAuthenticated(true);
        } else {
          window.localStorage.removeItem("adminToken");
        }
      } catch (error) {
        console.error("Error al verificar sesión", error);
        window.localStorage.removeItem("adminToken");
      }
    };

    void verifySession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        window.localStorage.setItem("adminToken", data.token);
        setIsAuthenticated(true);
        setPassword("");
      } else {
        setError("Credenciales inválidas");
        setPassword("");
      }
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      setError("No se pudo conectar con el servidor");
    } finally {
      setIsSubmitting(false);
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
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500">{error}</p>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </Button>
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

          <Button
            onClick={() => {
              window.localStorage.removeItem("adminToken");
              setIsAuthenticated(false);
            }}
            variant="outline"
          >
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
