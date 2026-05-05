import { Package, TrendingUp, AlertCircle, Coffee } from "lucide-react";

interface DashboardProps {
  totalProducts: number;
  totalStock: number;
  lowStock: number;
}

export function Dashboard({ totalProducts, totalStock, lowStock }: DashboardProps) {
  return (
    <header className="bg-gradient-to-r from-[#2C5530] to-[#1E4620] text-white py-8 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Coffee className="w-12 h-12 text-[#FFE89D]" />
          <h1 className="text-3xl lg:text-4xl font-bold">Control de Stock - Productos</h1>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#FFE89D]/30">
            <div className="flex items-center gap-4">
              <div className="bg-[#FFE89D] p-3 rounded-full">
                <Package className="w-8 h-8 text-[#2C5530]" />
              </div>
              <div>
                <p className="text-[#FFE89D] text-sm">Total Productos</p>
                <p className="text-4xl">{totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#FFE89D]/30">
            <div className="flex items-center gap-4">
              <div className="bg-[#FFE89D] p-3 rounded-full">
                <TrendingUp className="w-8 h-8 text-[#2C5530]" />
              </div>
              <div>
                <p className="text-[#FFE89D] text-sm">Stock Total</p>
                <p className="text-4xl">{totalStock}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#FFE89D]/30">
            <div className="flex items-center gap-4">
              <div className="bg-[#FFE89D] p-3 rounded-full">
                <AlertCircle className="w-8 h-8 text-[#2C5530]" />
              </div>
              <div>
                <p className="text-[#FFE89D] text-sm">Stock Bajo</p>
                <p className="text-4xl">{lowStock}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
