import { useState, useMemo } from "react";
import { Mate } from "../components/utils/types";
import { ProductCard } from "../components/ProductCard";
import { Footer } from "../components/Footer";
import { PublicHeader } from "../components/PublicHeader";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";

interface ProductGalleryProps {
  products: Mate[];
  onSelectProduct: (product: Mate, selectedColor: string | null) => void;
  showFooter?: boolean;
  showHeader?: boolean;
}

export function ProductGallery({
  products,
  onSelectProduct,
  showFooter = true,
  showHeader = true,
}: ProductGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStock, setFilterStock] = useState<"todos" | "disponibles">(
    "todos",
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");

  const categories = useMemo(() => {
    const cats = new Set(
      products
        .map((p) => p.categories?.name)
        .filter((cat) => cat !== undefined) as string[],
    );

    return Array.from(cats).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStock =
        filterStock === "disponibles" ? product.stock > 0 : true;

      const matchesCategory =
        selectedCategory === "todos"
          ? true
          : product.categories?.name === selectedCategory;

      return matchesSearch && matchesStock && matchesCategory;
    });
  }, [products, searchTerm, filterStock, selectedCategory]);

  if (products.length === 0) {
    return (
      <>
        {showHeader && <PublicHeader />}

        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto bg-white border-4 border-[#FFE89D] rounded-2xl p-12 text-center">
            <p className="text-2xl text-[#2C5530]">
              No hay productos disponibles
            </p>
          </div>
        </section>

        {showFooter && <Footer />}
      </>
    );
  }

  return (
    <>
      {showHeader && <PublicHeader />}

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* BUSCADOR */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2C5530]/40" />

              <Input
                type="text"
                placeholder="🔍 Buscar productos por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-2 border-[#2C5530]/20 focus:border-[#2C5530]"
              />
            </div>

            {/* FILTROS */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStock("todos")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStock === "todos"
                    ? "bg-[#2C5530] text-white"
                    : "bg-[#FFE89D]/30 text-[#2C5530]"
                }`}
              >
                Todos
              </button>

              <button
                onClick={() => setFilterStock("disponibles")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStock === "disponibles"
                    ? "bg-[#2C5530] text-white"
                    : "bg-[#FFE89D]/30 text-[#2C5530]"
                }`}
              >
                En Stock
              </button>

              <div className="flex-1 min-w-[200px]">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg font-medium border-2 border-[#2C5530]/20 bg-white text-[#2C5530]"
                >
                  <option value="todos">📦 Todas las categorías</option>

                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {searchTerm && (
              <p className="text-sm text-[#2C5530]/60">
                {filteredProducts.length === 0
                  ? `No se encontraron productos para "${searchTerm}"`
                  : `Se encontraron ${filteredProducts.length} producto(s)`}
              </p>
            )}
          </div>

          {/* GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-[#2C5530]/60">
                  No hay productos que coincidan con tu búsqueda
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {showFooter && <Footer />}
    </>
  );
}
