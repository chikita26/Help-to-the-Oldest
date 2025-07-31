import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ServicesSection from "@/components/services-section";
import AmbitionsSection from "@/components/ambitions-section";
import NewsSection from "@/components/news-section";
import TestimonialsSection from "@/components/testimonials-section";  
import GallerySection from "@/components/gallery-section";
import VolunteerCtaSection from "@/components/volunteer-cta-section";
import DonationSection from "@/components/donation-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <AmbitionsSection />
      <NewsSection />
      <TestimonialsSection />
      <GallerySection />
      <VolunteerCtaSection />
      <DonationSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
