import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextFormField } from "@/components/ui/form-field-wrapper";
import { LoadingButton } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { handleApiError } = useErrorHandler();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'interface d'administration",
      });
      setLocation("/admin");
    },
    onError: (error) => {
      handleApiError(error, "auth");
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-warm-gray flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-navy mb-2">
              Administration HELP To OLDEST
            </h1>
            <p className="text-slate-600">
              Connectez-vous pour accéder au tableau de bord
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TextFormField
                control={form.control}
                name="username"
                label="Nom d'utilisateur"
                placeholder="Votre nom d'utilisateur"
                required
              />

              <TextFormField
                control={form.control}
                name="password"
                label="Mot de passe"
                type="password"
                placeholder="Votre mot de passe"
                required
              />

              <LoadingButton
                type="submit"
                className="w-full bg-primary hover:bg-blue-700 text-white"
                isLoading={loginMutation.isPending}
                loadingText="Connexion..."
              >
                Se connecter
              </LoadingButton>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}