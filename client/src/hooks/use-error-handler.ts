import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

export interface ErrorHandlerOptions {
  title?: string;
  fallbackMessage?: string;
  logToConsole?: boolean;
}

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback(
    (error: unknown, options: ErrorHandlerOptions = {}) => {
      const {
        title = "Erreur",
        fallbackMessage = "Une erreur inattendue s'est produite. Veuillez réessayer.",
        logToConsole = true,
      } = options;

      if (logToConsole) {
        console.error("Error caught by error handler:", error);
      }

      let errorMessage = fallbackMessage;

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = String(error.message);
      }

      toast({
        variant: "destructive",
        title,
        description: errorMessage,
      });
    },
    [toast]
  );

  const handleApiError = useCallback(
    (error: unknown, context?: string) => {
      let title = "Erreur";
      let fallbackMessage = "Une erreur s'est produite. Veuillez réessayer.";

      if (context) {
        switch (context) {
          case "contact":
            title = "Erreur d'envoi";
            fallbackMessage = "Impossible d'envoyer votre message. Veuillez réessayer.";
            break;
          case "donation":
            title = "Erreur de don";
            fallbackMessage = "Impossible de traiter votre don. Veuillez réessayer.";
            break;
          case "volunteer":
            title = "Erreur d'inscription";
            fallbackMessage = "Impossible de traiter votre inscription. Veuillez réessayer.";
            break;
          case "auth":
            title = "Erreur d'authentification";
            fallbackMessage = "Problème de connexion. Veuillez vérifier vos identifiants.";
            break;
          case "payment":
            title = "Erreur de paiement";
            fallbackMessage = "Le paiement n'a pas pu être traité. Veuillez réessayer.";
            break;
        }
      }

      handleError(error, { title, fallbackMessage });
    },
    [handleError]
  );

  const handleNetworkError = useCallback(
    (error: unknown) => {
      handleError(error, {
        title: "Problème de connexion",
        fallbackMessage: "Vérifiez votre connexion internet et réessayez.",
      });
    },
    [handleError]
  );

  return {
    handleError,
    handleApiError,
    handleNetworkError,
  };
}