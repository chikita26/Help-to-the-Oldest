import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertDonationSchema, type InsertDonation } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

export default function DonationSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertDonation>({
    resolver: zodResolver(insertDonationSchema),
    defaultValues: {
      donorName: "",
      email: "",
      amount: "",
      type: "",
      message: ""
    }
  });

  const donationMutation = useMutation({
    mutationFn: async (data: InsertDonation) => {
      const response = await apiRequest("POST", "/api/donations", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Don enregistré !",
        description: "Merci pour votre générosité. Nous vous contacterons pour finaliser le don."
      });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement du don. Veuillez réessayer."
      });
    }
  });

  const onSubmit = (data: InsertDonation) => {
    donationMutation.mutate(data);
  };

  const benefits = [
    "Financer les campagnes de santé gratuite",
    "Soutenir l'aide alimentaire d'urgence",
    "Développer les centres spécialisés",
    "Former plus de volontaires"
  ];

  return (
    <section id="don" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Faire un Don</h2>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
            <p className="text-lg text-slate-600">Votre générosité peut changer la vie d'une personne âgée</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-navy mb-6">Pourquoi donner ?</h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="text-white text-sm" size={16} />
                    </div>
                    <p className="text-slate-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-warm-gray p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-navy mb-6">Modalités de Don</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-navy mb-2">Virement Bancaire</h4>
                  <p className="text-slate-600 text-sm">Coordonnées bancaires disponibles sur demande</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-navy mb-2">Mobile Money</h4>
                  <p className="text-slate-600 text-sm">MTN Mobile Money et Orange Money acceptés</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-navy mb-2">Dons en Nature</h4>
                  <p className="text-slate-600 text-sm">Médicaments, denrées alimentaires, équipements médicaux</p>
                </div>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-secondary hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold mt-6 transition-colors">
                    Faire un Don Maintenant
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Formulaire de Don</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="donorName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom complet</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type de don</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez le type de don" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="monetary">Don monétaire</SelectItem>
                                <SelectItem value="nature">Don en nature</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Montant (FCFA) ou Description</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ex: 50000 FCFA ou Médicaments pour diabète"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message (optionnel)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Un message d'encouragement..."
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full bg-secondary hover:bg-orange-600"
                        disabled={donationMutation.isPending}
                      >
                        {donationMutation.isPending ? "Enregistrement..." : "Confirmer le Don"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
