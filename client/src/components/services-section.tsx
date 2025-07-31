import { Shield, Heart, Utensils, Megaphone, Users, Home } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      icon: Shield,
      title: "Sécurité Sociale",
      description: "Soutien psychologique et juridique pour garantir les droits et la protection des personnes âgées.",
      color: "text-primary bg-primary"
    },
    {
      icon: Heart,
      title: "Vieillissement en Santé",
      description: "Programmes de santé préventive et soins médicaux adaptés aux besoins des seniors.",
      color: "text-green-500 bg-green-500"
    },
    {
      icon: Utensils,
      title: "Aide Alimentaire",
      description: "Distribution de denrées alimentaires et soutien nutritionnel pour les personnes âgées vulnérables.",
      color: "text-secondary bg-secondary"
    },
    {
      icon: Megaphone,
      title: "Plaidoyer",
      description: "Sensibilisation et défense des droits des personnes âgées auprès des institutions.",
      color: "text-purple-500 bg-purple-500"
    },
    {
      icon: Users,
      title: "Collaboration Intergénérationnelle",
      description: "Programmes favorisant les échanges entre générations et le partage d'expériences.",
      color: "text-yellow-500 bg-yellow-500"
    },
    {
      icon: Home,
      title: "Centres Spécialisés",
      description: "Développement de centres d'accueil et de soins adaptés aux besoins des personnes âgées.",
      color: "text-red-500 bg-red-500"
    }
  ];

  return (
    <section id="services" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Nos Centres d'Intérêts</h2>
          <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Six domaines d'action pour améliorer la qualité de vie des personnes âgées
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className={`w-16 h-16 ${service.color.split(' ')[1]} bg-opacity-10 rounded-full flex items-center justify-center mb-6`}>
                <service.icon className={`${service.color.split(' ')[0]} text-2xl`} size={32} />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-4">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
