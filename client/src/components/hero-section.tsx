import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="accueil"
      className="relative bg-gradient-to-br from-primary to-navy text-white py-20"
    >
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: "url('https://i.postimg.cc/m2GCBQHs/photo2.png')",
        }}
      ></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Ensemble redonnons-leur le sourire
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light leading-relaxed">
            Association humanitaire non gouvernementale dédiée au bien-être des
            personnes âgées au Cameroun
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollToSection("services")}
              variant={"outline"}
              className="px-8 text-foreground py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Découvrir nos actions
            </Button>
            <Button
              onClick={() => scrollToSection("volontaire")}
              className="hover:scale-105 px-8 py-4 rounded-lg font-semibold text-lg transition-all"
            >
              Devenir volontaire
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
