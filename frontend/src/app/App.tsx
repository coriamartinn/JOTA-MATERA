import { useState, useMemo, useEffect } from "react";
import { RouterProvider } from "react-router";
import {
  Mate,
  StockMovement,
  StockMovementType,
} from "./components/utils/types";
import { createAppRouter } from "./routes";

const REST_URL = "https://jota-matera-vopt.vercel.app/";

export default function App() {
  const [products, setProducts] = useState<Mate[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH PRODUCTOS
  ========================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${REST_URL}`);
        const data = await response.json();

        const mappedProducts = data.map((p: any) => ({
          ...p,
          price: Number(p.price),
          cost: Number(p.cost),
          sales: p.sales || 0,
        }));

        setProducts(mappedProducts);
        setLoading(false);
      } catch (e) {
        console.error("Error al conectar con jota matera API", e);
      }
    };

    fetchProducts();
  }, []);

  /* =========================
     HISTORIAL DE STOCK
  ========================= */

  const recordStockMovement = (
    productId: string | number,
    productName: string,
    type: StockMovementType,
    quantity: number,
    previousStock: number,
    newStock: number,
    reason?: string,
  ) => {
    const movement: StockMovement = {
      id: Date.now().toString(),
      productId: String(productId),
      productName,
      type,
      quantity,
      previousStock,
      newStock,
      reason,
      timestamp: new Date(),
    };

    setStockMovements((prev) => [movement, ...prev]);
  };

  /* =========================
     CREAR PRODUCTO
  ========================= */

  const addProduct = async (newProduct: Omit<Mate, "id">) => {
    try {
      const response = await fetch(`${REST_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newProduct.name,
          price: newProduct.price,
          cost: newProduct.cost,
          stock: newProduct.stock,
          stockMin: newProduct.stockMin,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error backend:", error);
        return;
      }

      const product = await response.json();

      setProducts((prev) => [...prev, product]);

      recordStockMovement(
        String(product.id),
        product.name,
        "entrada",
        product.stock,
        0,
        product.stock,
        "Producto nuevo agregado",
      );
    } catch (e) {
      console.error("Error al agregar producto:", e);
    }
  };

  /* =========================
     UPDATE PRODUCTO
  ========================= */

  const updateProduct = async (id: number | string, updates: Partial<Mate>) => {
    try {
      const payload: any = {
        name: updates.name,
        price: updates.price,
        cost: updates.cost,
        stock: updates.stock,
        stockMin: updates.stockMin,
        sales: updates.sales,
      };

      // convertir categories → categoryId
      if (updates.categories?.id) {
        payload.categoryId = updates.categories.id;
      }

      const response = await fetch(`${REST_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error backend:", error);
        return;
      }

      const updatedProduct = await response.json();

      setProducts((prev) => {
        const product = prev.find((p) => p.id === id);

        if (
          product &&
          updates.stock !== undefined &&
          updates.stock !== product.stock
        ) {
          const difference = updates.stock - product.stock;

          const type: StockMovementType = difference > 0 ? "entrada" : "salida";

          recordStockMovement(
            String(id),
            product.name,
            type,
            Math.abs(difference),
            product.stock,
            updates.stock,
            "Actualización manual de stock",
          );
        }

        return prev.map((p) => (p.id === id ? updatedProduct : p));
      });
    } catch (e) {
      console.error("Error al actualizar producto:", e);
    }
  };

  /* =========================
     DELETE PRODUCTO
  ========================= */

  const deleteProduct = async (id: number | string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const response = await fetch(`${REST_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error backend:", error);
        return;
      }

      const product = products.find((p) => p.id === id);

      if (product) {
        recordStockMovement(
          String(id),
          product.name,
          "salida",
          product.stock,
          product.stock,
          0,
          "Producto eliminado",
        );
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error("Error al eliminar producto:", e);
    }
  };

  /* =========================
     HISTORIAL
  ========================= */

  const deleteStockMovement = (movementId: string) => {
    if (!confirm("¿Está seguro de eliminar este movimiento?")) return;

    setStockMovements((prev) => prev.filter((m) => m.id !== movementId));
  };

  const updateStockMovement = (
    movementId: string,
    updates: Partial<StockMovement>,
  ) => {
    setStockMovements((prev) =>
      prev.map((m) => (m.id === movementId ? { ...m, ...updates } : m)),
    );
  };

  /* =========================
     ROUTER
  ========================= */

  const router = useMemo(
    () =>
      createAppRouter({
        products,
        onAdd: addProduct,
        onUpdate: updateProduct,
        onDelete: deleteProduct,
        stockMovements,
        recordStockMovement,
        deleteStockMovement,
        updateStockMovement,
      }),
    [products, stockMovements],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Cargando inventario...
      </div>
    );
  }

  return <RouterProvider router={router} />;
}
