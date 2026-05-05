import { Coffee, Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#2C5530] to-[#1E4620] text-white py-12 px-4 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Sobre nosotros */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="w-6 h-6 text-[#FFE89D]" />
              <h3 className="text-2xl font-bold">Jota Matera</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Especialistas en artículos de mate con más de 10 años de experiencia. Calidad y tradición en cada producto.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-bold text-[#FFE89D] mb-4">Contacto</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FFE89D]" />
                <a href="tel:+5491141466547" className="hover:text-[#FFE89D] transition-colors">+54 911 4146 6547</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FFE89D]" />
                <a href="mailto:info@jotamatera.com" className="hover:text-[#FFE89D] transition-colors">info@jotamatera.com</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FFE89D]" />
                <span>Buenos Aires, Argentina</span>
              </div>
            </div>
          </div>

          {/* Síguenos */}
          <div>
            <h4 className="text-lg font-bold text-[#FFE89D] mb-4">Síguenos</h4>
            <div className="flex gap-4">
              <a href="#" className="bg-white/10 hover:bg-[#FFE89D] hover:text-[#2C5530] p-3 rounded-full transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-[#FFE89D] hover:text-[#2C5530] p-3 rounded-full transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://wa.me/5491141466547" className="bg-white/10 hover:bg-[#FFE89D] hover:text-[#2C5530] p-3 rounded-full transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="text-center text-sm text-gray-300">
            <p>© 2026 Jota Matera. Todos los derechos reservados.</p>
            <p className="mt-2 text-xs">💡 Consejo: No uses agua hirviendo. Lo ideal es entre 70–80°C</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
