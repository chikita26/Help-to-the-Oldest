import { useFormSubmission } from "./use-form-submission";
import { insertDonationSchema, type InsertDonation } from "@shared/schema";

export function useDonationForm(onSuccess?: () => void) {
  return useFormSubmission<InsertDonation>({
    schema: insertDonationSchema,
    apiEndpoint: "/api/donations",
    successTitle: "Don enregistré !",
    successMessage: "Merci pour votre générosité. Nous vous contacterons pour finaliser le don.",
    errorMessage: "Une erreur s'est produite lors de l'enregistrement du don. Veuillez réessayer.",
    onSuccess,
    defaultValues: {
      donorName: "",
      email: "",
      amount: "",
      type: "",
      message: "",
    },
  });
}

export const DONATION_TYPE_OPTIONS = [
  { value: "monetary", label: "Don monétaire" },
  { value: "nature", label: "Don en nature" },
];