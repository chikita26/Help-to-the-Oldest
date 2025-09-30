import { MapPin, Mail, Phone, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PageSection } from "@/components/ui/page-section";
import { IconContentCard } from "@/components/ui/icon-content-card";
import { TextFormField, TextareaFormField, SelectFormField } from "@/components/ui/form-field-wrapper";
import { LoadingButton } from "@/components/ui/loading-spinner";
import { useContactForm, CONTACT_SUBJECT_OPTIONS } from "@/hooks/use-contact-form";

export default function ContactSection() {
  const { form, handleSubmit, isSubmitting } = useContactForm();

  return (
    <PageSection
      id="contact"
      title="Contactez-nous"
      subtitle="Nous sommes là pour répondre à vos questions."
      background="gray"
      centered
    >
      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div>
          <h3 className="text-2xl font-semibold text-navy mb-8">
            Informations de Contact
          </h3>
          <div className="space-y-6">
            <IconContentCard
              icon={MapPin}
              title="Adresse"
              content={
                <>
                  Yaoundé, Cameroun
                  <br />
                  Mbalmayo, Département du Nyong et So'o
                </>
              }
            />

            <IconContentCard
              icon={Mail}
              title="Email"
              content={
                <a
                  href="mailto:helptooldestasso@gmail.com"
                  className="text-slate-600 hover:text-primary transition-colors"
                >
                  helptooldestasso@gmail.com
                </a>
              }
            />

            <IconContentCard
              icon={Phone}
              title="Téléphone"
              content={
                <div className="space-y-1">
                  <a href="tel:+237695842668" className="block hover:text-primary transition-colors">
                    +237 695 842 668
                  </a>
                  <a href="tel:+237679395853" className="block hover:text-primary transition-colors">
                    +237 679 395 853
                  </a>
                  <a href="tel:+237655215822" className="block hover:text-primary transition-colors">
                    +237 655 215 822
                  </a>
                </div>
              }
            />
          </div>

              {/* Social Media */}
              <div className="mt-8">
                <h4 className="font-semibold text-navy mb-4">Suivez-nous</h4>
                <div className="flex space-x-4">
                  <a
                    href="https://www.facebook.com/61564113427822/"
                    className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href="https://x.com/AssociationHOLD"
                    className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white hover:bg-sky-600 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter size={20} />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/association-humanitaire-help-to-oldest-hold"
                    className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
            </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <h3 className="text-2xl font-semibold text-navy mb-6">
            Envoyez-nous un message
          </h3>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <TextFormField
                  control={form.control}
                  name="firstName"
                  label="Prénom"
                  placeholder="Votre prénom"
                  required
                />
                <TextFormField
                  control={form.control}
                  name="lastName"
                  label="Nom"
                  placeholder="Votre nom"
                  required
                />
              </div>

              <TextFormField
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="votre.email@exemple.com"
                required
              />

              <SelectFormField
                control={form.control}
                name="subject"
                label="Sujet"
                options={CONTACT_SUBJECT_OPTIONS}
                placeholder="Sélectionnez un sujet"
                required
              />

              <TextareaFormField
                control={form.control}
                name="message"
                label="Message"
                placeholder="Décrivez votre demande..."
                rows={4}
                required
              />

              <LoadingButton
                type="submit"
                className="w-full bg-primary hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                isLoading={isSubmitting}
                loadingText="Envoi en cours..."
              >
                Envoyer le Message
              </LoadingButton>
            </form>
          </Form>
        </div>
      </div>
    </PageSection>
  );
}
