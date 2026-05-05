import { useState } from "react";
import { Mate } from "./utils/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Pencil, Trash2, Save, X, AlertTriangle } from "lucide-react";
import { formatARS } from "./utils/currency";

interface ProductListProps {
  products: Mate[];
  onUpdate: (id: number | string, updates: Partial<Mate>) => void;
  onDelete: (id: number | string) => void;
}

export function ProductList({
  products,
  onUpdate,
  onDelete,
}: ProductListProps) {
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Mate>>({});

  const startEdit = (product: Mate) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (editingId !== null) {
      onUpdate(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const addSale = (product: Mate) => {
    if (product.stock <= 0) {
      alert("No hay stock disponible para registrar la venta.");
      return;
    }

    onUpdate(product.id, {
      sales: (product.sales || 0) + 1,
      stock: product.stock - 1,
    });
  };

  const removeSale = (product: Mate) => {
    if ((product.sales || 0) <= 0) {
      alert("No hay ventas para descontar.");
      return;
    }

    onUpdate(product.id, {
      sales: (product.sales || 0) - 1,
      stock: product.stock + 1,
    });
  };

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-[#FFE89D]/20 border-2 border-[#FFE89D] rounded-2xl p-12 text-center">
          <p className="text-2xl text-[#2C5530]">
            No hay productos en el inventario. ¡Agrega tu primer mate!
          </p>
        </div>
      </div>
    );
  }

  const totalRendirGeneral = products.reduce(
    (sum, p) => sum + (p.sales || 0) * (p.cost || 0),
    0,
  );

  const totalGananciaGeneral = products.reduce(
    (sum, p) => sum + (p.sales || 0) * ((p.price || 0) - (p.cost || 0)),
    0,
  );

  const updateField = (field: keyof Mate, value: any) => {
    setEditForm({
      ...editForm,
      [field]: value,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl mb-6 text-[#2C5530]">Inventario de Productos</h2>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-[#FFE89D]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#2C5530] to-[#1E4620] text-white">
              <tr>
                <th className="px-6 py-4 text-left">Producto</th>
                <th className="px-6 py-4 text-left">Categoría</th>
                <th className="px-6 py-4 text-left">Precio</th>
                <th className="px-6 py-4 text-left">Costo</th>
                <th className="px-6 py-4 text-left">Stock</th>
                <th className="px-6 py-4 text-left">Stock Mín.</th>
                <th className="px-6 py-4 text-left">Estado</th>
                <th className="px-6 py-4 text-left">Ventas</th>
                <th className="px-6 py-4 text-left">Total a rendir</th>
                <th className="px-6 py-4 text-left">Ganancia neta</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product, index) => {
                const isLowStock = product.stock <= product.stockMin;
                const isEditing = editingId === product.id;

                const totalRendir = (product.sales || 0) * (product.cost || 0);
                const totalGanancia =
                  (product.sales || 0) *
                  ((product.price || 0) - (product.cost || 0));

                return (
                  <tr
                    key={product.id}
                    className={`border-b border-[#FFE89D]/30 ${
                      index % 2 === 0 ? "bg-[#FFE89D]/5" : "bg-white"
                    } ${isLowStock ? "bg-red-50" : ""}`}
                  >
                    {/* PRODUCTO */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <Input
                          value={editForm.name || ""}
                          onChange={(e) => updateField("name", e.target.value)}
                          className="h-9"
                        />
                      ) : (
                        <span className="text-[#2C5530]">{product.name}</span>
                      )}
                    </td>

                    {/* CATEGORIA */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-[#FFE89D] text-[#2C5530] rounded-full text-sm">
                        {product.categories?.name || "Sin categoría"}
                      </span>
                    </td>

                    {/* PRECIO */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editForm.price ?? ""}
                          onChange={(e) =>
                            updateField("price", Number(e.target.value))
                          }
                          className="h-9 w-24"
                        />
                      ) : (
                        <span className="text-[#2C5530]">
                          {formatARS(product.price)}
                        </span>
                      )}
                    </td>

                    {/* COSTO */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editForm.cost ?? ""}
                          onChange={(e) =>
                            updateField("cost", Number(e.target.value))
                          }
                          className="h-9 w-24"
                        />
                      ) : (
                        <span className="text-[#2C5530]">
                          {formatARS(product.cost || 0)}
                        </span>
                      )}
                    </td>

                    {/* STOCK */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editForm.stock ?? ""}
                          onChange={(e) =>
                            updateField("stock", Number(e.target.value))
                          }
                          className="h-9 w-20"
                        />
                      ) : (
                        <span
                          className={
                            isLowStock ? "text-red-600" : "text-[#2C5530]"
                          }
                        >
                          {product.stock}
                        </span>
                      )}
                    </td>

                    {/* STOCK MIN */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editForm.stockMin ?? ""}
                          onChange={(e) =>
                            updateField("stockMin", Number(e.target.value))
                          }
                          className="h-9 w-20"
                        />
                      ) : (
                        <span className="text-[#2C5530]">
                          {product.stockMin}
                        </span>
                      )}
                    </td>

                    {/* ESTADO */}
                    <td className="px-6 py-4">
                      {isLowStock ? (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="w-5 h-5" />
                          <span className="text-sm">Bajo</span>
                        </div>
                      ) : (
                        <span className="text-green-600 text-sm">Normal</span>
                      )}
                    </td>

                    {/* VENTAS */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editForm.sales ?? 0}
                          onChange={(e) =>
                            updateField("sales", Number(e.target.value))
                          }
                          className="h-9 w-20"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="min-w-[20px] text-center">
                            {product.sales || 0}
                          </span>

                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => addSale(product)}
                              variant="outline"
                              className="h-7 px-2 border-green-400 text-green-600 hover:bg-green-50"
                            >
                              +
                            </Button>

                            <Button
                              size="sm"
                              onClick={() => removeSale(product)}
                              variant="outline"
                              className="h-7 px-2 border-red-400 text-red-600 hover:bg-red-50"
                            >
                              -
                            </Button>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* TOTAL RENDIR */}
                    <td className="px-6 py-4">{formatARS(totalRendir)}</td>

                    {/* GANANCIA */}
                    <td className="px-6 py-4">{formatARS(totalGanancia)}</td>

                    {/* ACCIONES */}
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            onClick={saveEdit}
                            className="bg-[#2C5530] text-white"
                          >
                            <Save className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm"
                            onClick={cancelEdit}
                            variant="outline"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            onClick={() => startEdit(product)}
                            variant="outline"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => onDelete(product.id)}
                            variant="outline"
                            className="border-red-300 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* Totales */}
              <tr className="bg-[#FFE89D]/20 font-bold text-[#2C5530]">
                <td colSpan={8} className="px-6 py-4 text-right">
                  Totales generales:
                </td>

                <td className="px-6 py-4">{formatARS(totalRendirGeneral)}</td>

                <td className="px-6 py-4">{formatARS(totalGananciaGeneral)}</td>

                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
