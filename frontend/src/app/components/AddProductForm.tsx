import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Mate } from "./utils/types";

interface CreateProductDto {
  name: string;
  price: number;
  cost: number;
  stock?: number;
  stockMin?: number;
  categoryId?: number;
  images?: Record<string, string>;
}

interface AddProductFormProps {
  onAdd: (product: Mate) => void;
}

const REST_URL = "http://localhost:4015/inventory";

export function AddProductForm({ onAdd }: AddProductFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    cost: "",
    stock: "",
    stockMin: "",
    categoryId: "1",
    images: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imagesObj: Record<string, string> = {};

    if (formData.images.trim()) {
      const pairs = formData.images.split("|");

      pairs.forEach((pair) => {
        const [color, url] = pair.split(":").map((s) => s.trim());

        if (color && url) {
          imagesObj[color] = url;
        }
      });
    }

    const product: CreateProductDto = {
      name: formData.name,
      price: Number(formData.price),
      cost: Number(formData.cost),
      stock: formData.stock ? Number(formData.stock) : undefined,
      stockMin: formData.stockMin ? Number(formData.stockMin) : undefined,
      categoryId: Number(formData.categoryId),
      images: Object.keys(imagesObj).length ? imagesObj : undefined,
    };

    try {
      const res = await fetch(`${REST_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error(error);
        alert("Error al crear el producto");
        return;
      }

      const newProduct: Mate = await res.json();

      // 🔹 actualizar estado en el admin
      onAdd(newProduct);

      alert("Producto creado correctamente");

      setFormData({
        name: "",
        price: "",
        cost: "",
        stock: "",
        stockMin: "",
        categoryId: "1",
        images: "",
      });

      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error conectando con el servidor");
    }
  };

  if (!isOpen) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-[#FFE89D] hover:bg-[#F5D76E] text-[#2C5530] shadow-lg h-12 px-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Agregar Producto
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-[#FFE89D]">
        <h2 className="text-3xl mb-6 text-[#2C5530]">Agregar Nuevo Producto</h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div>
            <Label>Nombre</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label>Costo</Label>
            <Input
              type="number"
              value={formData.cost}
              onChange={(e) =>
                setFormData({ ...formData, cost: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label>Precio</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label>Stock</Label>
            <Input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Stock mínimo</Label>
            <Input
              type="number"
              value={formData.stockMin}
              onChange={(e) =>
                setFormData({ ...formData, stockMin: e.target.value })
              }
            />
          </div>

          <div>
            <Label>ID Categoría</Label>
            <Input
              type="number"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
            />
          </div>

          <div className="md:col-span-2">
            <Label>Imágenes por color</Label>

            <Input
              placeholder="negro:https://img.jpg|blanco:https://img.jpg"
              value={formData.images}
              onChange={(e) =>
                setFormData({ ...formData, images: e.target.value })
              }
            />

            <p className="text-gray-500 text-sm mt-2">
              Formato: color:url | color:url
            </p>
          </div>

          <div className="md:col-span-2 flex gap-4 mt-4">
            <Button
              type="submit"
              className="flex-1 bg-[#2C5530] hover:bg-[#1E4620] text-white h-12"
            >
              Crear Producto
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-2 border-[#2C5530]"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
