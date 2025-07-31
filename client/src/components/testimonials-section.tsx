import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Marie Nkoa",
      location: "Mbalmayo",
      content: "Grâce à HOLD, j'ai retrouvé l'espoir. Les soins médicaux gratuits m'ont permis de mieux gérer mon diabète. Je me sens moins seule grâce aux visites régulières des volontaires.",
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"
    },
    {
      name: "Paul Mbida",
      role: "Volontaire",
      content: "Être volontaire chez HOLD a changé ma vision de la solidarité. Chaque sourire des personnes âgées que nous aidons me remplit de joie. C'est une expérience humaine extraordinaire.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"
    },
    {
      name: "Jean Atangana",
      location: "Yaoundé",
      content: "L'aide alimentaire de HOLD m'a permis de traverser une période difficile. L'équipe est professionnelle et bienveillante. Ils redonnent vraiment le sourire aux personnes âgées.",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"
    },
    {
      name: "Sylvie Fouda",
      role: "Bénévole",
      content: "Participer aux campagnes de santé HOLD m'a enrichie professionnellement et humainement. Voir l'impact direct de nos actions sur la vie des seniors est gratifiant.",
      image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"
    },
    {
      name: "Marguerite Onana",
      location: "Mbalmayo",
      content: "Les activités intergénérationnelles organisées par HOLD ont rapproché notre famille. Mes petits-enfants adorent participer aux événements. C'est formidable !",
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"
    },
    {
      name: "Dr. Emilie Mba",
      role: "Médecin Volontaire",
      content: "Collaborer avec HOLD m'a permis d'apporter mes compétences médicales là où elles sont le plus nécessaires. L'organisation est sérieuse et l'impact réel.",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"
    }
  ];

  return (
    <section id="temoignages" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Témoignages</h2>
          <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
          <p className="text-lg text-slate-600">Ce que disent nos bénéficiaires et volontaires</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-warm-gray p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-navy">{testimonial.name}</h4>
                  <p className="text-sm text-slate-600">{testimonial.location || testimonial.role}</p>
                </div>
              </div>
              <div className="flex text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-slate-700 italic leading-relaxed">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
