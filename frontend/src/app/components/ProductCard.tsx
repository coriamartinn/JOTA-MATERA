import { useState } from "react";
import { Mate } from "../components/utils/types";

const COLOR_MAP: Record<string, string> = {
  negro: "#1a1a1a",
  blanco: "#f5f5f5",
  plata: "#C0C0C0",
  borravino: "#4e130a",
  rojo: "#e53e3e",
  azul: "#3182ce",
  verde: "#2C5530",
  dorado: "#D4AF37",
};

interface ProductCardProps {
  product: Mate;
  onSelectProduct: (product: Mate, selectedColor: string | null) => void;
}

export function ProductCard({ product, onSelectProduct }: ProductCardProps) {
  // Obtener colores disponibles del objeto images
  const availableColors = product.images ? Object.keys(product.images) : [];

  // Pre-seleccionar el primer color disponible
  const [selectedColor, setSelectedColor] = useState<string | null>(
    availableColors.length > 0 ? availableColors[0] : null,
  );

  const isLowStock = product.stock <= product.stockMin;

  // 🔹 Convertimos el precio a número para evitar errores
  const price = Number(product.price ?? 0);

  // Determinar la imagen según el color seleccionado
  const currentImage =
    selectedColor && product.images?.[selectedColor]
      ? product.images[selectedColor]
      : product.image;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-4 border-[#FFE89D] hover:shadow-2xl transition-all transform">
      {/* Imagen */}
      <div className="relative w-full bg-[#FFE89D]/10 flex items-center justify-center min-h-[250px]">
        {currentImage ? (
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sin imagen
          </div>
        )}

        {isLowStock && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm shadow-lg">
            Stock Bajo
          </div>
        )}
      </div>

      {/* Información */}
      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-[#2C5530]">{product.name}</h3>

        {/* Precio */}
        <span className="text-2xl font-bold text-[#2C5530]">
          ${price.toFixed(2)}
        </span>

        {/* Categoría */}
        {product.categories && (
          <span className="text-sm text-gray-500">
            Categoría:{" "}
            <span className="font-medium text-[#2C5530]">
              {product.categories.name}
            </span>
          </span>
        )}

        {/* Selector de Color */}
        {availableColors.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-500">
              Color:{" "}
              <span className="font-medium text-[#2C5530]">
                {selectedColor
                  ? selectedColor.charAt(0).toUpperCase() +
                    selectedColor.slice(1)
                  : "Selecciona uno"}
              </span>
            </span>

            <div className="flex gap-2 flex-wrap">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  title={color}
                  className="relative w-9 h-9 rounded-full border-2 border-gray-300 transition-transform hover:scale-110"
                  style={{
                    backgroundColor:
                      COLOR_MAP[color.toLowerCase()] ?? "#cccccc",
                  }}
                >
                  {selectedColor === color && (
                    <span className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-[#2C5530]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Botón Consultar */}
        <button
          onClick={() => onSelectProduct(product, selectedColor)}
          disabled={availableColors.length > 0 && !selectedColor}
          className="mt-3 w-full bg-gradient-to-r from-[#2C5530] to-[#1E4620] hover:from-[#1E4620] hover:to-[#2C5530] disabled:opacity-50 disabled:cursor-not-allowed text-white h-10 rounded-lg transition-all"
        >
          Consultar
          {selectedColor
            ? ` · ${
                selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)
              }`
            : ""}
        </button>
      </div>
    </div>
  );
}
