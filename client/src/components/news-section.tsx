export default function NewsSection() {
  const newsItems = [
    {
      date: "13 Juillet 2025",
      title: "Campagne de santé gratuite pour les personnes âgées",
      description: "Campagne de santé communautaire gratuite organisée à l'esplanade de la paroisse bienheureuse Anuaritte d'Obeck. Plus de 70 bénéficiaires.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
    },
    {
      date: "14 Juin 2025",
      title: "Visite à domicile à Mbalmayo",
      description: "Série de visites à domicile pour toucher du doigt les réalités auxquelles font face nos aînés.",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
    },
    {
      date: "2024",
      title: "Journée Internationale de la Personne Âgée",
      description: "Célébration de la 34e édition des JIPA 2024 avec engagement renouvelé pour le bien-être des personnes âgées.",
      image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
    },
    {
      date: "27 Octobre 2024",
      title: "Remise de dons à domicile",
      description: "Distribution de dons aux personnes âgées de Mbalmayo. Des moments riches en émotion qui leur ont redonné le sourire.",
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
    },
    {
      date: "16 Novembre 2024",
      title: "Assemblée Générale Trimestrielle",
      description: "Rencontre d'évaluation des actions et planification des futurs projets humanitaires.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
    },
    {
      date: "Décembre 2024",
      title: "Noël avec les Seniors",
      description: "Partage et amour au cœur des actions de l'Association humanitaire HOLD pendant les fêtes.",
      image: "https://images.unsplash.com/photo-1576354302919-96748cb8299e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
    }
  ];

  return (
    <section id="actualites" className="py-16 bg-warm-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Actualités</h2>
          <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
          <p className="text-lg text-slate-600">Nos dernières actions et événements</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <article key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-6">
                <div className="text-sm text-secondary font-medium mb-2">{item.date}</div>
                <h3 className="text-xl font-semibold text-navy mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
