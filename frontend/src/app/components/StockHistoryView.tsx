import { StockMovement } from "./utils/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowUp, ArrowDown, Edit3, AlertCircle, Trash2, Save, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "./ui/input";
import { Select } from "./ui/select";

interface StockHistoryViewProps {
  movements: StockMovement[];
  onDelete?: (movementId: string) => void;
  onUpdate?: (movementId: string, updates: Partial<StockMovement>) => void;
}

export function StockHistoryView({ movements, onDelete, onUpdate }: StockHistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<StockMovement>>({});

  const filteredMovements = useMemo(() => {
    return movements.filter((m) =>
      m.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [movements, searchTerm]);

  const startEdit = (movement: StockMovement) => {
    setEditingId(movement.id);
    setEditForm(movement);
  };

  const saveEdit = () => {
    if (editingId && onUpdate) {
      onUpdate(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (movementId: string) => {
    if (onDelete && confirm("¿Estás seguro de eliminar este movimiento?")) {
      onDelete(movementId);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "entrada":
        return <ArrowUp className="w-4 h-4" />;
      case "salida":
        return <ArrowDown className="w-4 h-4" />;
      case "ajuste":
        return <Edit3 className="w-4 h-4" />;
      case "venta":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "entrada":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            {getTypeIcon(type)}
            Entrada
          </Badge>
        );
      case "salida":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            {getTypeIcon(type)}
            Salida
          </Badge>
        );
      case "ajuste":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
            {getTypeIcon(type)}
            Ajuste
          </Badge>
        );
      case "venta":
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            {getTypeIcon(type)}
            Venta
          </Badge>
        );
      default:
        return null;
    }
  };

  const getQuantityColor = (type: string) => {
    return type === "entrada" || type === "venta" ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="space-y-4">
      <Card className="border-2 border-[#2C5530]/20">
        <CardHeader className="bg-gradient-to-r from-[#2C5530]/10 to-[#1E4620]/10">
          <CardTitle className="text-[#2C5530] flex items-center gap-2">
            📊 Historial de Movimientos de Stock
          </CardTitle>
          <CardDescription>
            {filteredMovements.length === 0
              ? "Sin movimientos registrados"
              : `${filteredMovements.length} movimiento${filteredMovements.length !== 1 ? "s" : ""}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6">
            <Input
              placeholder="🔍 Buscar por nombre de producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-2 border-[#2C5530]/20 focus:border-[#2C5530]"
            />
          </div>

          {filteredMovements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm ? "No se encontraron movimientos" : "Sin movimientos"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMovements.map((movement) => {
                const isEditing = editingId === movement.id;

                if (isEditing) {
                  return (
                    <div
                      key={movement.id}
                      className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400 rounded-lg p-4 space-y-4"
                    >
                      <h4 className="font-bold text-[#2C5530]">Editando: {movement.productName}</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Stock Anterior</label>
                          <Input
                            type="number"
                            value={editForm.previousStock || ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, previousStock: parseInt(e.target.value) })
                            }
                            className="border-2 border-[#2C5530]/20"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Cantidad</label>
                          <Input
                            type="number"
                            value={editForm.quantity || ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, quantity: parseInt(e.target.value) })
                            }
                            className="border-2 border-[#2C5530]/20"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Stock Nuevo</label>
                          <Input
                            type="number"
                            value={editForm.newStock || ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, newStock: parseInt(e.target.value) })
                            }
                            className="border-2 border-[#2C5530]/20"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Tipo</label>
                          <select
                            value={editForm.type || "entrada"}
                            onChange={(e) =>
                              setEditForm({ ...editForm, type: e.target.value as any })
                            }
                            className="w-full px-3 py-2 border-2 border-[#2C5530]/20 rounded-md focus:border-[#2C5530] focus:ring-[#2C5530]"
                          >
                            <option value="entrada">Entrada</option>
                            <option value="salida">Salida</option>
                            <option value="ajuste">Ajuste</option>
                            <option value="venta">Venta</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Motivo</label>
                        <Input
                          value={editForm.reason || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, reason: e.target.value })
                          }
                          className="border-2 border-[#2C5530]/20"
                          placeholder="Ej: Corrección de inventario"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={saveEdit}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Guardar
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          variant="outline"
                          className="border-gray-400"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={movement.id}
                    className="bg-gradient-to-r from-[#FFE89D]/20 to-[#F5D76E]/20 border-l-4 border-[#2C5530] rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-shrink-0">{getTypeBadge(movement.type)}</div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#2C5530] text-lg">
                            {movement.productName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {new Date(movement.timestamp).toLocaleDateString("es-AR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className={`text-3xl font-bold ${getQuantityColor(movement.type)}`}>
                            {movement.type === "entrada" || movement.type === "venta"
                              ? "+"
                              : "-"}
                            {movement.quantity}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => startEdit(movement)}
                            size="sm"
                            variant="outline"
                            className="border-blue-400 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(movement.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-400 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#2C5530]/10">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Anterior</p>
                        <p className="text-xl font-bold text-gray-700">{movement.previousStock}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                          {movement.type === "entrada" || movement.type === "venta"
                            ? "Agregado"
                            : "Removido"}
                        </p>
                        <p className={`text-xl font-bold ${getQuantityColor(movement.type)}`}>
                          {movement.type === "entrada" || movement.type === "venta"
                            ? "+"
                            : "-"}
                          {movement.quantity}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Nuevo</p>
                        <p className="text-xl font-bold text-[#2C5530]">{movement.newStock}</p>
                      </div>
                    </div>

                    {movement.reason && (
                      <div className="mt-3 pt-3 border-t border-[#2C5530]/10">
                        <p className="text-sm">
                          <strong className="text-[#2C5530]">Motivo:</strong>{" "}
                          <span className="text-gray-700">{movement.reason}</span>
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
