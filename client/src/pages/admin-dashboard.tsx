import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Users, MessageSquare, Heart, DollarSign, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { apiRequest } from "@/lib/queryClient";
import type { Contact, Volunteer, Donation } from "@shared/schema";

interface AdminStats {
  totalContacts: number;
  totalVolunteers: number;
  totalDonations: number;
  recentContacts: Contact[];
  recentVolunteers: Volunteer[];
  recentDonations: Donation[];
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Use authentication guard with admin requirement
  const { user, isLoading: authLoading, isAuthenticated } = useAuthGuard({
    requireAdmin: true,
    redirectTo: "/admin/login"
  });

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/stats");
      return response.json();
    },
    enabled: isAuthenticated, // Only fetch stats if authenticated
  });

  const { data: contacts } = useQuery<Contact[]>({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/contacts");
      return response.json();
    },
    enabled: isAuthenticated, // Only fetch if authenticated
  });

  const { data: volunteers } = useQuery<Volunteer[]>({
    queryKey: ["admin-volunteers"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/volunteers");
      return response.json();
    },
    enabled: isAuthenticated, // Only fetch if authenticated
  });

  const { data: donations } = useQuery<Donation[]>({
    queryKey: ["admin-donations"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/donations");
      return response.json();
    },
    enabled: isAuthenticated, // Only fetch if authenticated
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      setLocation("/admin/login");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Show loading while checking authentication or loading stats
  if (authLoading || (isAuthenticated && statsLoading)) {
    return (
      <div className="min-h-screen bg-warm-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">
            {authLoading ? "Vérification de l'authentification..." : "Chargement du tableau de bord..."}
          </p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-warm-gray">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-navy">
            Tableau de bord - HELP To OLDEST
          </h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut size={16} />
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalContacts || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{stats?.recentContacts.length || 0} récents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Volontaires</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalVolunteers || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{stats?.recentVolunteers.length || 0} récents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dons</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalDonations || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{stats?.recentDonations.length || 0} récents
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="contacts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="contacts">Messages de contact</TabsTrigger>
            <TabsTrigger value="volunteers">Candidatures volontaires</TabsTrigger>
            <TabsTrigger value="donations">Dons reçus</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Messages de contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contacts?.map((contact) => (
                    <div
                      key={contact.id}
                      className="border rounded-lg p-4 bg-white"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">
                          {contact.firstName} {contact.lastName}
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(contact.createdAt!).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Email: {contact.email}
                      </p>
                      <p className="text-sm font-medium mb-2">
                        Sujet: {contact.subject}
                      </p>
                      <p className="text-sm">{contact.message}</p>
                    </div>
                  )) || (
                    <p className="text-center text-muted-foreground py-8">
                      Aucun message de contact
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="volunteers">
            <Card>
              <CardHeader>
                <CardTitle>Candidatures de volontaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {volunteers?.map((volunteer) => (
                    <div
                      key={volunteer.id}
                      className="border rounded-lg p-4 bg-white"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">
                          {volunteer.firstName} {volunteer.lastName}
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(volunteer.createdAt!).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Email:</p>
                          <p>{volunteer.email}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Téléphone:</p>
                          <p>{volunteer.phone}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Profession:</p>
                          <p>{volunteer.profession || "Non spécifiée"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Disponibilité:</p>
                          <p>{volunteer.availability}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-muted-foreground text-sm">Motivation:</p>
                        <p className="text-sm">{volunteer.motivation}</p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-center text-muted-foreground py-8">
                      Aucune candidature de volontaire
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle>Dons reçus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {donations?.map((donation) => (
                    <div
                      key={donation.id}
                      className="border rounded-lg p-4 bg-white"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{donation.donorName}</h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(donation.createdAt!).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Email:</p>
                          <p>{donation.email}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Montant:</p>
                          <p className="font-semibold">{donation.amount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Type:</p>
                          <p>{donation.type}</p>
                        </div>
                      </div>
                      {donation.message && (
                        <div className="mt-4">
                          <p className="text-muted-foreground text-sm">Message:</p>
                          <p className="text-sm">{donation.message}</p>
                        </div>
                      )}
                    </div>
                  )) || (
                    <p className="text-center text-muted-foreground py-8">
                      Aucun don reçu
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}