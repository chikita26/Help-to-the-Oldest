import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Marie Nkoa",
      location: "Bénéficiaire Mbalmayo",
      content: "Grâce à HOLD, j'ai retrouvé l'espoir. Je me sens moins seule grâce aux visites régulières des volontaires.",
      image: "https://i.postimg.cc/ctttw7nd/Photo3.jpg"
    },
    {
      name: "Jodel TAPINGOUA",
      role: "Volontaire",
      content: "Être volontaire chez HOLD a changé ma vision de la solidarité. Chaque sourire des personnes âgées que nous aidons me remplit de joie. Prendre soin d'eux c'est nous rappeler qui nous sommes.",
      image: "https://i.postimg.cc/5H9HnWC7/Photo10.jpg"
    },
    {
      name: "Jean Atangana",
      location: "Yaoundé",
      content: "L'aide alimentaire de HOLD m'a permis de traverser une période difficile. L'équipe est professionnelle et bienveillante. Ils redonnent vraiment le sourire aux personnes âgées.",
      image: "https://i.postimg.cc/GhmMTkYp/IMG-9197.jpg"
    },
    {
      name: "Danelle KONGUE",
      role: "Etudiante en médécine - Bénévole",
      content: "Participer aux campagnes de santé HOLD m'a enrichie professionnellement et humainement. Prendre soin de nos aînés c'est prendre soin de notre propre avenir.",
      image: "https://i.postimg.cc/WbYmXWfQ/Photo6.jpg"
    },
    {
      name: "Marguerite Onana",
      location: "Bénéficiaire Hôpital central",
      content: " Le ''Noël avec les séniors'' organisé par HOLD m'a redonné le sourrire ce 27/12/2024. Les autres patients et moi avions adoré participer à cet événement. C'était formidable !",
      image: "https://i.postimg.cc/kGnNhkCd/Photo1.png"
    },
    {
      name: "Dr. Yvan MVE",
      role: "Médecin Volontaire",
      content: "Faire partir de HOLD m'a permis d'apporter mes compétences médicales là où elles sont le plus nécessaires. L'indifférence fait viellir plus vite que le temps mais une main tendue ou un acte de soin rallume la flamme dans les coeurs fatigués.",
      image: "https://i.postimg.cc/CxZGtG3d/Photo8.jpg"
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
