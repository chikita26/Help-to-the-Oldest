export default function AboutSection() {
  return (
    <section id="propos" className="py-16 bg-warm-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Qui sommes-nous ?</h2>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg leading-relaxed mb-6">
                Help to Oldest "HOLD" est une association humanitaire non gouvernementale, à but non lucratif qui rassemble des volontaires de tout horizon sans distinction de sexe et de genre.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Elle a pour objet de promouvoir le bien-être des personnes âgées. Association légalement reconnue au Cameroun depuis le 16 août 2024 par le préfet du département du Nyong et So'o.
              </p>
              <div className="bg-white p-6 rounded-lg border-l-4 border-secondary">
                <p className="font-semibold text-navy mb-2">Reconnaissance légale</p>
                <p className="text-slate-600">Récépissé de déclaration numéro 60/RDA/J10/SASC du 16 août 2024</p>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Volontaires travaillant avec des personnes âgées" 
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
