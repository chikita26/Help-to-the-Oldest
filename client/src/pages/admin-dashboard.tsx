import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Users,
  MessageSquare,
  Heart,
  LogOut,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Inbox,
  UserCheck,
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SearchBar } from "@/components/ui/search-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { DonationTypeBadge, AvailabilityBadge, SubjectBadge } from "@/components/ui/status-badge";
import { useToast } from "@/hooks/use-toast";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { apiRequest } from "@/lib/queryClient";
import type { Contact, Volunteer, Donation } from "@shared/schema";
import { useState, useMemo } from "react";

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

  // Search states
  const [contactSearch, setContactSearch] = useState("");
  const [volunteerSearch, setVolunteerSearch] = useState("");
  const [donationSearch, setDonationSearch] = useState("");

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

  // Filtered data based on search
  const filteredContacts = useMemo(() => {
    if (!contacts) return [];
    const query = contactSearch.toLowerCase();
    return contacts.filter(
      (c) =>
        c.firstName.toLowerCase().includes(query) ||
        c.lastName.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.subject.toLowerCase().includes(query) ||
        c.message.toLowerCase().includes(query)
    );
  }, [contacts, contactSearch]);

  const filteredVolunteers = useMemo(() => {
    if (!volunteers) return [];
    const query = volunteerSearch.toLowerCase();
    return volunteers.filter(
      (v) =>
        v.firstName.toLowerCase().includes(query) ||
        v.lastName.toLowerCase().includes(query) ||
        v.email.toLowerCase().includes(query) ||
        v.phone.toLowerCase().includes(query) ||
        (v.profession && v.profession.toLowerCase().includes(query))
    );
  }, [volunteers, volunteerSearch]);

  const filteredDonations = useMemo(() => {
    if (!donations) return [];
    const query = donationSearch.toLowerCase();
    return donations.filter(
      (d) =>
        d.donorName.toLowerCase().includes(query) ||
        d.email.toLowerCase().includes(query) ||
        (d.amount && d.amount.toLowerCase().includes(query)) ||
        d.type.toLowerCase().includes(query)
    );
  }, [donations, donationSearch]);

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
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Messages de Contact
              </CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">
                {stats?.totalContacts || 0}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <p className="text-xs text-green-600 font-medium">
                  +{stats?.recentContacts.length || 0} ce mois
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Candidatures Volontaires
              </CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">
                {stats?.totalVolunteers || 0}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <p className="text-xs text-green-600 font-medium">
                  +{stats?.recentVolunteers.length || 0} ce mois
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Dons Reçus
              </CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <Heart className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">
                {stats?.totalDonations || 0}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <p className="text-xs text-green-600 font-medium">
                  +{stats?.recentDonations.length || 0} ce mois
                </p>
              </div>
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>Messages de contact</CardTitle>
                  <div className="w-full sm:w-80">
                    <SearchBar
                      placeholder="Rechercher par nom, email, sujet..."
                      onSearch={setContactSearch}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredContacts.length > 0 ? (
                  <div className="space-y-4">
                    {filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-gray-900">
                              {contact.firstName} {contact.lastName}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <SubjectBadge subject={contact.subject} />
                              <span className="text-xs text-gray-500">
                                <Calendar className="inline h-3 w-3 mr-1" />
                                {new Date(contact.createdAt!).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric"
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.location.href = `mailto:${contact.email}`}
                              className="flex items-center gap-1"
                            >
                              <Mail className="h-4 w-4" />
                              <span className="hidden sm:inline">Email</span>
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-600">
                            <Mail className="inline h-4 w-4 mr-2 text-gray-400" />
                            {contact.email}
                          </p>
                          <div className="bg-gray-50 rounded-lg p-3 mt-3">
                            <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Inbox}
                    title={contactSearch ? "Aucun résultat trouvé" : "Aucun message de contact"}
                    description={
                      contactSearch
                        ? "Essayez avec d'autres termes de recherche"
                        : "Les messages de contact apparaîtront ici"
                    }
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="volunteers">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>Candidatures de volontaires</CardTitle>
                  <div className="w-full sm:w-80">
                    <SearchBar
                      placeholder="Rechercher par nom, email, téléphone..."
                      onSearch={setVolunteerSearch}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredVolunteers.length > 0 ? (
                  <div className="space-y-4">
                    {filteredVolunteers.map((volunteer) => (
                      <div
                        key={volunteer.id}
                        className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-gray-900">
                              {volunteer.firstName} {volunteer.lastName}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <AvailabilityBadge availability={volunteer.availability} />
                              <span className="text-xs text-gray-500">
                                <Calendar className="inline h-3 w-3 mr-1" />
                                {new Date(volunteer.createdAt!).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric"
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.location.href = `mailto:${volunteer.email}`}
                              className="flex items-center gap-1"
                            >
                              <Mail className="h-4 w-4" />
                              <span className="hidden sm:inline">Email</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.location.href = `tel:${volunteer.phone}`}
                              className="flex items-center gap-1"
                            >
                              <Phone className="h-4 w-4" />
                              <span className="hidden sm:inline">Appeler</span>
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 truncate">{volunteer.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{volunteer.phone}</span>
                          </div>
                          {volunteer.profession && (
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{volunteer.profession}</span>
                            </div>
                          )}
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 mt-3">
                          <p className="text-xs text-gray-500 font-medium mb-1">Motivation</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {volunteer.motivation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={UserCheck}
                    title={volunteerSearch ? "Aucun résultat trouvé" : "Aucune candidature de volontaire"}
                    description={
                      volunteerSearch
                        ? "Essayez avec d'autres termes de recherche"
                        : "Les candidatures de volontaires apparaîtront ici"
                    }
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>Dons reçus</CardTitle>
                  <div className="w-full sm:w-80">
                    <SearchBar
                      placeholder="Rechercher par nom, montant, type..."
                      onSearch={setDonationSearch}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredDonations.length > 0 ? (
                  <div className="space-y-4">
                    {filteredDonations.map((donation) => (
                      <div
                        key={donation.id}
                        className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-gray-900">
                              {donation.donorName}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <DonationTypeBadge type={donation.type} />
                              <span className="text-xs text-gray-500">
                                <Calendar className="inline h-3 w-3 mr-1" />
                                {new Date(donation.createdAt!).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric"
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.location.href = `mailto:${donation.email}`}
                              className="flex items-center gap-1"
                            >
                              <Mail className="h-4 w-4" />
                              <span className="hidden sm:inline">Email</span>
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600 truncate">{donation.email}</span>
                          </div>
                          {donation.amount && (
                            <div className="flex items-center gap-2">
                              <Gift className="h-4 w-4 text-gray-400" />
                              <span className={`font-semibold ${
                                donation.type === "monetary"
                                  ? "text-emerald-700"
                                  : "text-amber-700"
                              }`}>
                                {donation.type === "monetary"
                                  ? `${donation.amount} FCFA`
                                  : donation.amount
                                }
                              </span>
                            </div>
                          )}
                        </div>
                        {donation.message && (
                          <div className="bg-gray-50 rounded-lg p-3 mt-3">
                            <p className="text-xs text-gray-500 font-medium mb-1">Message du donateur</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {donation.message}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Gift}
                    title={donationSearch ? "Aucun résultat trouvé" : "Aucun don reçu"}
                    description={
                      donationSearch
                        ? "Essayez avec d'autres termes de recherche"
                        : "Les dons reçus apparaîtront ici"
                    }
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}