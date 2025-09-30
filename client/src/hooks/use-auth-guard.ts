import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AuthUser {
  id: number;
  username: string;
  role: string;
}

interface AuthResponse {
  user: AuthUser;
}

interface UseAuthGuardOptions {
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { requireAdmin = false, redirectTo = "/admin/login" } = options;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: authData, isLoading, error } = useQuery<AuthResponse>({
    queryKey: ["auth-check"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/auth/me");
      return response.json();
    },
    retry: false,
  });

  useEffect(() => {
    if (!isLoading) {
      // Check for authentication errors
      if (error && (error.message.includes("401") || error.message.includes("Not authenticated"))) {
        toast({
          variant: "destructive",
          title: "Accès non autorisé",
          description: "Veuillez vous connecter pour accéder à cette page.",
        });
        setLocation(redirectTo);
        return;
      }

      // Check for admin role requirement
      if (requireAdmin && authData && authData.user && authData.user.role !== "admin") {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous n'avez pas les permissions d'administrateur.",
        });
        setLocation("/");
        return;
      }
    }
  }, [isLoading, error, authData, requireAdmin, redirectTo, setLocation, toast]);

  return {
    user: authData?.user,
    isLoading,
    isAuthenticated: !!authData && !error,
    isAdmin: authData?.user?.role === "admin",
  };
}