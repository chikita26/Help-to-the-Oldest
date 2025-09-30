export default function GallerySection() {
  const galleryImages = [
    // Elderly care activities (6 images)
    {
      src: "https://i.postimg.cc/DZh18t8b/Photo11.jpg",
      alt: "Activité cuisine avec les seniors"
    },
    {
      src: "https://i.postimg.cc/D0yscLQv/Photo13.jpg",
      alt: "Cours d'exercice pour personnes âgées"
    },
    {
      src: "https://i.postimg.cc/kGnNhkCd/Photo1.png",
      alt: "Consultation médicale pour seniors"
    },
    {
      src: "https://i.postimg.cc/yY8Xh4nm/Photo7.jpg",
      alt: "Activités de lecture et apprentissage"
    },
    {
      src: "https://i.postimg.cc/PJ3DVJKm/Photo14.jpg",
      alt: "Activités sociales avec les seniors"
    },
    {
      src: "https://i.postimg.cc/GhmMTkYp/IMG-9197.jpg",
      alt: "Soins et compagnie pour personnes âgées"
    },
    // Humanitarian volunteers (4 images)
    {
      src: "https://i.postimg.cc/PxMYZ2wV/Photo12.jpg",
      alt: "Volontaires distribuant de la nourriture"
    },
    {
      src: "https://i.postimg.cc/pL5NTk0D/Affiche-de-remise-de-dipl-mes-ext-rieure-traditionnelle-en-bleu-blanc-et-or-7.png",
      alt: "Équipe de travailleurs humanitaires"
    },
    {
      src: "https://i.postimg.cc/fbFfbjr0/Image1.png",
      alt: "Volontaires aidant des personnes âgées"
    },
    {
      src: "https://i.postimg.cc/cHLGsWPJ/IMG-20250714-WA1148.jpg",
      alt: "Volontaires de sensibilisation communautaire"
    },
    // Community health services (4 images)
    {
      src: "https://i.postimg.cc/rw1Bxzkm/IMG-20250714-WA1144.jpg",
      alt: "Dépistage de santé communautaire"
    },
    {
      src: "https://i.postimg.cc/ydbtsZFf/IMG-20250714-WA1154.jpg",
      alt: "Clinique mobile de santé"
    },
    {
      src: "https://i.postimg.cc/3NnjMnr0/Photo3.jpg",
      alt: "Session d'éducation à la santé"
    },
    {
      src: "https://i.postimg.cc/6Qnd695X/Photo10.jpg",
      alt: "Agents de santé communautaire"
    },
    // Intergenerational activities (3 images)
    {
      src: "https://i.postimg.cc/gkH96nd0/Capture-d-cran-2025-08-06-184525.png",
      alt: "Grands-parents avec petits-enfants"
    },
    {
      src: "https://i.postimg.cc/bww5Dg36/Capture-d-cran-2025-08-06-185011.png",
      alt: "Rassemblement familial multigénérationnel"
    },
    {
      src: "https://i.postimg.cc/PfBfMLBz/Whats-App-Image-2025-05-06-16-32-24-3abf0d23.jpg",
      alt: "Jeunes apprenant des personnes âgées"
    }
  ];

  return (
    <section className="py-16 bg-warm-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Galerie Photo</h2>
          <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
          <p className="text-lg text-slate-600">Découvrez nos actions en images</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <img 
              key={index}
              src={image.src} 
              alt={image.alt} 
              className="rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
