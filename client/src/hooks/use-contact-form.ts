import { useFormSubmission } from "./use-form-submission";
import { insertContactSchema, type InsertContact } from "@shared/schema";

export function useContactForm() {
  return useFormSubmission<InsertContact>({
    schema: insertContactSchema,
    apiEndpoint: "/api/contact",
    successTitle: "Message envoyé !",
    successMessage: "Merci pour votre message. Nous vous répondrons dans les plus brefs délais.",
    errorContext: "contact",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
  });
}

export const CONTACT_SUBJECT_OPTIONS = [
  { value: "volontariat", label: "Volontariat" },
  { value: "don", label: "Don et financement" },
  { value: "partenariat", label: "Partenariat" },
  { value: "information", label: "Demande d'information" },
  { value: "autre", label: "Autre" },
];