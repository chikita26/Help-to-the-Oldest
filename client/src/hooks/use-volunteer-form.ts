import { useFormSubmission } from "./use-form-submission";
import { insertVolunteerSchema, type InsertVolunteer } from "@shared/schema";

export function useVolunteerForm() {
  return useFormSubmission<InsertVolunteer>({
    schema: insertVolunteerSchema,
    apiEndpoint: "/api/volunteers",
    successTitle: "Candidature envoyée !",
    successMessage: "Merci pour votre intérêt. Nous examinerons votre candidature et vous contacterons bientôt.",
    errorMessage: "Une erreur s'est produite lors de l'envoi de votre candidature. Veuillez réessayer.",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      profession: "",
      motivation: "",
      availability: "",
    },
  });
}

export const VOLUNTEER_AVAILABILITY_OPTIONS = [
  { value: "weekdays", label: "En semaine" },
  { value: "weekends", label: "Week-ends" },
  { value: "evenings", label: "Soirées" },
  { value: "flexible", label: "Flexible" },
  { value: "occasional", label: "Occasionnel" },
];