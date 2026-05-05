import { Coffee, Lock } from "lucide-react";
import { Link } from "react-router";

export function PublicHeader() {
  return (
    <header className="bg-gradient-to-r from-[#2C5530] to-[#1E4620] text-white py-6 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Coffee className="w-10 h-10 text-[#FFE89D]" />
          <h1 className="text-2xl lg:text-3xl font-bold">Jota Matera</h1>
        </div>

        <Link to="/admin">
          <button className="bg-white/10 backdrop-blur-sm border-2 border-[#FFE89D]/50 hover:border-[#FFE89D] hover:bg-white/20 text-[#FFE89D] px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-semibold">Admin</span>
          </button>
        </Link>
      </div>
    </header>
  );
}
