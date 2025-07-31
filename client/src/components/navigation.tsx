import { useState } from "react";
import { Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Heart className="text-white text-lg" size={20} />
            </div>
            <div className="font-bold text-xl text-navy">HELP To OLDEST</div>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('accueil')} 
              className="text-slate-600 hover:text-primary transition-colors"
            >
              Accueil
            </button>
            <button 
              onClick={() => scrollToSection('propos')} 
              className="text-slate-600 hover:text-primary transition-colors"
            >
              À Propos
            </button>
            <button 
              onClick={() => scrollToSection('services')} 
              className="text-slate-600 hover:text-primary transition-colors"
            >
              Nos Actions
            </button>
            <button 
              onClick={() => scrollToSection('actualites')} 
              className="text-slate-600 hover:text-primary transition-colors"
            >
              Actualités
            </button>
            <button 
              onClick={() => scrollToSection('temoignages')} 
              className="text-slate-600 hover:text-primary transition-colors"
            >
              Témoignages
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-slate-600 hover:text-primary transition-colors"
            >
              Contact
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => scrollToSection('don')} 
              className="bg-secondary text-white hover:bg-orange-600 transition-colors font-medium"
            >
              Faire un Don
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 py-4">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('accueil')} 
                className="text-slate-600 hover:text-primary transition-colors text-left"
              >
                Accueil
              </button>
              <button 
                onClick={() => scrollToSection('propos')} 
                className="text-slate-600 hover:text-primary transition-colors text-left"
              >
                À Propos
              </button>
              <button 
                onClick={() => scrollToSection('services')} 
                className="text-slate-600 hover:text-primary transition-colors text-left"
              >
                Nos Actions
              </button>
              <button 
                onClick={() => scrollToSection('actualites')} 
                className="text-slate-600 hover:text-primary transition-colors text-left"
              >
                Actualités
              </button>
              <button 
                onClick={() => scrollToSection('temoignages')} 
                className="text-slate-600 hover:text-primary transition-colors text-left"
              >
                Témoignages
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="text-slate-600 hover:text-primary transition-colors text-left"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
