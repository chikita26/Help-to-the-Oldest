import { Heart, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
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
  };

  return (
    <footer className="bg-navy text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <Heart className="text-white text-lg" size={20} />
              </div>
              <div className="font-bold text-xl">HELP To OLDEST</div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Association humanitaire non gouvernementale dédiée au bien-être des personnes âgées au Cameroun. 
              Ensemble, redonnons-leur le sourire.
            </p>
            <div className="text-sm text-gray-400">
              <p>Récépissé de déclaration numéro 60/RDA/J10/SASC du 16 août 2024</p>
              <p>Légalement reconnue par le préfet du département du Nyong et So'o</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Liens Rapides</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button 
                  onClick={() => scrollToSection('accueil')} 
                  className="hover:text-secondary transition-colors"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('propos')} 
                  className="hover:text-secondary transition-colors"
                >
                  À Propos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="hover:text-secondary transition-colors"
                >
                  Nos Actions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('actualites')} 
                  className="hover:text-secondary transition-colors"
                >
                  Actualités
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('temoignages')} 
                  className="hover:text-secondary transition-colors"
                >
                  Témoignages
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="hover:text-secondary transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Agir</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button 
                  onClick={() => scrollToSection('don')} 
                  className="hover:text-secondary transition-colors"
                >
                  Faire un Don
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('volontaire')} 
                  className="hover:text-secondary transition-colors"
                >
                  Devenir Volontaire
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Partenariat
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Rapports d'Activité
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Newsletter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Copright by HELP To OLDEST. All rights reserved !
            </div>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/61564113427822/" 
                className="text-gray-400 hover:text-secondary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://x.com/AssociationHOLD" 
                className="text-gray-400 hover:text-secondary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/company/association-humanitaire-help-to-oldest-hold" 
                className="text-gray-400 hover:text-secondary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
