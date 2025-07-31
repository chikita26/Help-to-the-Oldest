import { HandHeart, Calendar, Building, Network, Megaphone, UserCog } from "lucide-react";

export default function AmbitionsSection() {
  const ambitions = [
    {
      icon: HandHeart,
      text: "Aider le maximum de seniors"
    },
    {
      icon: Calendar,
      text: "Organiser des activités chaque année"
    },
    {
      icon: Building,
      text: "Construire des centres spécialisés"
    },
    {
      icon: Network,
      text: "Constituer un réseau HOLD fiable"
    },
    {
      icon: Megaphone,
      text: "Faire des plaidoyers"
    },
    {
      icon: UserCog,
      text: "Réunir le maximum d'acteurs sur cette cause"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-navy text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Ambitions</h2>
          <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {ambitions.map((ambition, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ambition.icon className="text-white text-xl" size={24} />
              </div>
              <p className="font-medium">{ambition.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
