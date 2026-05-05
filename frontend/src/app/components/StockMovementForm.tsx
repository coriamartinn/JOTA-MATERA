import { useState } from "react";
import { Mate, StockMovementType } from "./utils/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Plus, Minus, Save } from "lucide-react";

interface StockMovementFormProps {
  products: Mate[];
  onRecordMovement: (
    productId: string | number,
    productName: string,
    type: StockMovementType,
    quantity: number,
    previousStock: number,
    newStock: number,
    reason?: string,
  ) => void;
}

export function StockMovementForm({
  products,
  onRecordMovement,
}: StockMovementFormProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [movementType, setMovementType] =
    useState<StockMovementType>("entrada");
  const [quantity, setQuantity] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const selectedProduct = products.find(
    (p) => p.id === parseInt(selectedProductId || "0"),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || !quantity || parseInt(quantity) === 0) {
      alert("Por favor completa todos los campos correctamente");
      return;
    }

    const qty = parseInt(quantity);
    const previousStock = selectedProduct.stock;
    const newStock =
      movementType === "entrada" || movementType === "venta"
        ? previousStock + qty
        : previousStock - qty;

    if (newStock < 0) {
      alert("No puedes reducir el stock por debajo de 0");
      return;
    }

    onRecordMovement(
      selectedProduct.id,
      selectedProduct.name,
      movementType,
      qty,
      previousStock,
      newStock,
      reason || undefined,
    );

    // Reset form
    setSelectedProductId("");
    setMovementType("entrada");
    setQuantity("");
    setReason("");
  };

  const previewNewStock =
    selectedProduct && quantity
      ? movementType === "entrada" || movementType === "venta"
        ? selectedProduct.stock + parseInt(quantity)
        : selectedProduct.stock - parseInt(quantity)
      : null;

  return (
    <Card className="border-2 border-[#2C5530]/20">
      <CardHeader className="bg-gradient-to-r from-[#2C5530]/10 to-[#1E4620]/10">
        <CardTitle className="text-[#2C5530] flex items-center gap-2">
          ➕ Registrar Movimiento de Stock
        </CardTitle>
        <CardDescription>
          Agrega entradas, salidas o ajustes al inventario
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Producto */}
            <div className="space-y-2">
              <Label className="text-[#2C5530] font-semibold">Producto</Label>
              <Select
                value={selectedProductId}
                onValueChange={setSelectedProductId}
              >
                <SelectTrigger className="border-2 border-[#2C5530]/20 focus:border-[#2C5530]">
                  <SelectValue placeholder="Selecciona un producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={String(product.id)}>
                      {product.name} (Current: {product.stock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de Movimiento */}
            <div className="space-y-2">
              <Label className="text-[#2C5530] font-semibold">
                Tipo de Movimiento
              </Label>
              <Select
                value={movementType}
                onValueChange={(v) => setMovementType(v as StockMovementType)}
              >
                <SelectTrigger className="border-2 border-[#2C5530]/20 focus:border-[#2C5530]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-green-600" /> Entrada
                    </span>
                  </SelectItem>
                  <SelectItem value="salida">
                    <span className="flex items-center gap-2">
                      <Minus className="w-4 h-4 text-red-600" /> Salida
                    </span>
                  </SelectItem>
                  <SelectItem value="venta">Venta</SelectItem>
                  <SelectItem value="ajuste">Ajuste</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cantidad */}
            <div className="space-y-2">
              <Label className="text-[#2C5530] font-semibold">Cantidad</Label>
              <Input
                type="number"
                min="1"
                placeholder="Ingresa la cantidad"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border-2 border-[#2C5530]/20 focus:border-[#2C5530]"
              />
            </div>

            {/* Motivo */}
            <div className="space-y-2">
              <Label className="text-[#2C5530] font-semibold">Motivo</Label>
              <Input
                type="text"
                placeholder="Ej: Compra a proveedor"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="border-2 border-[#2C5530]/20 focus:border-[#2C5530]"
              />
            </div>
          </div>

          {/* Preview */}
          {selectedProduct && quantity && (
            <div className="bg-gradient-to-r from-[#FFE89D]/20 to-[#F5D76E]/20 border-2 border-[#FFE89D] rounded-lg p-4 space-y-3">
              <h4 className="font-bold text-[#2C5530] flex items-center gap-2">
                👁️ Vista Previa del Cambio
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Stock Actual
                  </p>
                  <p className="text-2xl font-bold text-gray-700">
                    {selectedProduct.stock}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    {movementType === "entrada" || movementType === "venta"
                      ? "Sumar"
                      : "Restar"}
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      movementType === "entrada" || movementType === "venta"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {movementType === "entrada" || movementType === "venta"
                      ? "+"
                      : "-"}
                    {quantity}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Stock Nuevo
                  </p>
                  <p className="text-2xl font-bold text-[#2C5530]">
                    {previewNewStock}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#2C5530] to-[#1E4620] hover:from-[#1E4620] hover:to-[#2C5530] text-white h-12 font-semibold flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Registrar Movimiento
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
