import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertDonationSchema, type InsertDonation } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PAYMENT_CONFIG, generateUSSDCode } from "@shared/payment-config";

export default function DonationSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"form" | "payment">("form");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [donationData, setDonationData] = useState<InsertDonation | null>(null);
  const { toast } = useToast();

  const form = useForm<InsertDonation>({
    resolver: zodResolver(insertDonationSchema),
    defaultValues: {
      donorName: "",
      email: "",
      amount: "",
      type: "",
      message: "",
    },
  });

  const donationMutation = useMutation({
    mutationFn: async (data: InsertDonation) => {
      const response = await apiRequest("POST", "/api/donations", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Don enregistré !",
        description:
          "Merci pour votre générosité. Nous vous contacterons pour finaliser le don.",
      });
      // Use setTimeout to avoid immediate closure during payment step
      setTimeout(() => {
        resetDialog();
      }, 100);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          "Une erreur s'est produite lors de l'enregistrement du don. Veuillez réessayer.",
      });
    },
  });

  const onSubmit = (data: InsertDonation) => {
    // Only proceed to payment if it's a monetary donation
    if (data.type === "monetary") {
      setDonationData(data);
      setPaymentStep("payment");
    } else {
      // For non-monetary donations, submit directly
      donationMutation.mutate(data);
    }
  };

  const handlePaymentSuccess = () => {
    if (donationData) {
      donationMutation.mutate(donationData);
    }
  };

  const resetDialog = () => {
    setPaymentStep("form");
    setSelectedPaymentMethod("");
    setDonationData(null);
    form.reset();
    setIsDialogOpen(false);
  };

  const benefits = [
    "Financer les campagnes de santé gratuite",
    "Soutenir l'aide alimentaire d'urgence",
    "Développer les centres spécialisés",
    "Former plus de volontaires",
  ];

  return (
    <section id="don" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Faire un Don
            </h2>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
            <p className="text-lg text-slate-600">
              Votre générosité peut changer la vie d'une personne âgée
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-navy mb-6">
                Pourquoi donner ?
              </h3>
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
              <h3 className="text-xl font-semibold text-navy mb-6">
                Modalités de Don
              </h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-navy mb-2">
                    Virement Bancaire
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Coordonnées bancaires disponibles sur demande
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-navy mb-2">Mobile Money</h4>
                  <p className="text-slate-600 text-sm">
                    MTN Mobile Money et Orange Money acceptés
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-navy mb-2">Dons en Nature</h4>
                  <p className="text-slate-600 text-sm">
                    Médicaments, denrées alimentaires, équipements médicaux
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setIsDialogOpen(true)}
                className="w-full bg-secondary hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold mt-6 transition-colors"
              >
                Faire un Don Maintenant
              </Button>

              <Dialog open={isDialogOpen} onOpenChange={resetDialog}>
                <DialogContent
                  className="max-w-2xl h-[95vh] md:h-full overflow-y-auto"
                  key={paymentStep}
                >
                  <DialogHeader>
                    <DialogTitle>
                      {paymentStep === "form"
                        ? "Formulaire de Don"
                        : "Choisir le mode de paiement"}
                    </DialogTitle>
                    <DialogDescription>
                      {paymentStep === "form"
                        ? "Remplissez vos informations pour faire un don à notre organisation."
                        : "Sélectionnez votre méthode de paiement préférée pour finaliser votre don."}
                    </DialogDescription>

                    {/* Progress indicator */}
                    <div className="flex items-center justify-center space-x-4 mt-4 pt-4 border-b pb-4">
                      <div
                        className={`flex items-center ${
                          paymentStep === "form"
                            ? "text-blue-600"
                            : "text-green-600"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            paymentStep === "form"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {paymentStep === "form" ? "1" : "✓"}
                        </div>
                        <span className="ml-2 text-sm font-medium">
                          Informations
                        </span>
                      </div>
                      <div
                        className={`w-8 h-0.5 ${
                          paymentStep === "payment"
                            ? "bg-blue-300"
                            : "bg-gray-200"
                        }`}
                      ></div>
                      <div
                        className={`flex items-center ${
                          paymentStep === "payment"
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            paymentStep === "payment"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          2
                        </div>
                        <span className="ml-2 text-sm font-medium">
                          Paiement
                        </span>
                      </div>
                    </div>
                  </DialogHeader>
                  {paymentStep === "form" ? (
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
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
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez le type de don" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="monetary">
                                    Don monétaire
                                  </SelectItem>
                                  <SelectItem value="nature">
                                    Don en nature
                                  </SelectItem>
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
                              <FormLabel>
                                Montant (FCFA) ou Description
                              </FormLabel>
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
                          {donationMutation.isPending
                            ? "Enregistrement..."
                            : form.watch("type") === "monetary"
                            ? "Continuer vers le paiement"
                            : "Confirmer le Don"}
                        </Button>
                      </form>
                    </Form>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                          <h3 className="text-lg font-semibold text-green-800 mb-2">
                            Récapitulatif de votre don
                          </h3>
                          <p className="text-xl font-bold text-green-900">
                            Montant: {donationData?.amount} FCFA
                          </p>
                          <p className="text-sm text-green-700">
                            Donateur: {donationData?.donorName}
                          </p>
                          <p className="text-sm text-green-700">
                            Email: {donationData?.email}
                          </p>
                        </div>

                        <h3 className="text-xl font-semibold text-navy mb-4">
                          Choisissez votre mode de paiement
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Sélectionnez la méthode de paiement qui vous convient
                          le mieux
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 mb-8">
                        <Button
                          onClick={() => setSelectedPaymentMethod("paypal")}
                          variant={
                            selectedPaymentMethod === "paypal"
                              ? "default"
                              : "outline"
                          }
                          className="flex items-center justify-between p-4 h-auto"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center text-white text-sm font-bold">
                              PP
                            </div>
                            <div className="text-left">
                              <div className="font-semibold">PayPal</div>
                              <div className="text-sm text-gray-500">
                                Paiement international sécurisé
                              </div>
                            </div>
                          </div>
                          {selectedPaymentMethod === "paypal" && (
                            <div className="text-green-500">✓</div>
                          )}
                        </Button>

                        <Button
                          onClick={() => setSelectedPaymentMethod("mtn")}
                          variant={
                            selectedPaymentMethod === "mtn"
                              ? "default"
                              : "outline"
                          }
                          className="flex items-center justify-between p-4 h-auto"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-yellow-500 rounded mr-3 flex items-center justify-center text-white text-sm font-bold">
                              MTN
                            </div>
                            <div className="text-left">
                              <div className="font-semibold">
                                MTN Mobile Money
                              </div>
                              <div className="text-sm text-gray-500">
                                Paiement par téléphone mobile
                              </div>
                            </div>
                          </div>
                          {selectedPaymentMethod === "mtn" && (
                            <div className="text-green-500">✓</div>
                          )}
                        </Button>

                        <Button
                          onClick={() => setSelectedPaymentMethod("orange")}
                          variant={
                            selectedPaymentMethod === "orange"
                              ? "default"
                              : "outline"
                          }
                          className="flex items-center justify-between p-4 h-auto"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-orange-500 rounded mr-3 flex items-center justify-center text-white text-sm font-bold">
                              OM
                            </div>
                            <div className="text-left">
                              <div className="font-semibold">Orange Money</div>
                              <div className="text-sm text-gray-500">
                                Paiement par Orange Money
                              </div>
                            </div>
                          </div>
                          {selectedPaymentMethod === "orange" && (
                            <div className="text-green-500">✓</div>
                          )}
                        </Button>
                      </div>

                      {selectedPaymentMethod === "paypal" && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                          <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-full mr-3 flex items-center justify-center text-white font-bold">
                              PP
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-blue-900">
                                Paiement PayPal
                              </h3>
                              <p className="text-sm text-blue-700">
                                Paiement sécurisé via PayPal
                              </p>
                            </div>
                          </div>

                          <PayPalScriptProvider
                            options={{
                              clientId:
                                import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
                            }}
                          >
                            <PayPalButtons
                              createOrder={async () => {
                                const res = await fetch(
                                  "/api/paypal/create-order",
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      amount: donationData?.amount,
                                    }),
                                  }
                                );
                                const order = await res.json();
                                return order.id;
                              }}
                              onApprove={async (data) => {
                                const res = await fetch(
                                  "/api/paypal/capture-order",
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      orderID: data.orderID,
                                    }),
                                  }
                                );
                                const result = await res.json();
                                if (res.ok) {
                                  toast({
                                    title: "Paiement réussi !",
                                    description:
                                      "Votre don a été traité avec succès.",
                                  });
                                  handlePaymentSuccess();
                                }
                              }}
                            />
                          </PayPalScriptProvider>
                        </div>
                      )}

                      {(selectedPaymentMethod === "mtn" ||
                        selectedPaymentMethod === "orange") && (
                        <div
                          className={`border rounded-lg p-6 ${
                            selectedPaymentMethod === "mtn"
                              ? "bg-yellow-50 border-yellow-200"
                              : "bg-orange-50 border-orange-200"
                          }`}
                        >
                          <div className="flex items-center mb-4">
                            <div
                              className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white font-bold ${
                                selectedPaymentMethod === "mtn"
                                  ? "bg-yellow-500"
                                  : "bg-orange-500"
                              }`}
                            >
                              {selectedPaymentMethod === "mtn" ? "MTN" : "OM"}
                            </div>
                            <div>
                              <h3
                                className={`text-lg font-semibold ${
                                  selectedPaymentMethod === "mtn"
                                    ? "text-yellow-900"
                                    : "text-orange-900"
                                }`}
                              >
                                Paiement{" "}
                                {selectedPaymentMethod === "mtn"
                                  ? "MTN"
                                  : "Orange"}{" "}
                                Money
                              </h3>
                              <p
                                className={`text-sm ${
                                  selectedPaymentMethod === "mtn"
                                    ? "text-yellow-700"
                                    : "text-orange-700"
                                }`}
                              >
                                Paiement via{" "}
                                {selectedPaymentMethod === "mtn"
                                  ? "MTN Mobile Money"
                                  : "Orange Money"}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="bg-white p-4 rounded-lg border">
                              <h4 className="font-medium mb-2">Code USSD à composer :</h4>
                              <code className="text-lg font-mono bg-gray-100 px-3 py-2 rounded block">
                                {generateUSSDCode(
                                  selectedPaymentMethod === "mtn" ? "mtn" : "orange",
                                  donationData?.amount || ""
                                )}
                              </code>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p className="mb-2">Instructions :</p>
                              <ol className="list-decimal list-inside space-y-1">
                                {PAYMENT_CONFIG[selectedPaymentMethod === "mtn" ? "mtn" : "orange"].instructions.map((instruction, index) => (
                                  <li key={index}>{instruction}</li>
                                ))}
                              </ol>
                            </div>
                            <button
                              onClick={handlePaymentSuccess}
                              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                            >
                              J'ai effectué le paiement
                            </button>
                          </div>
                        </div>
                      )}

                      {!selectedPaymentMethod && (
                        <div className="text-center py-4">
                          <p className="text-gray-500 text-sm">
                            Veuillez sélectionner une méthode de paiement
                            ci-dessus
                          </p>
                        </div>
                      )}

                      <div className="flex gap-4 pt-4 border-t">
                        <Button
                          onClick={() => setPaymentStep("form")}
                          variant="outline"
                          className="flex-1"
                        >
                          ← Retour au formulaire
                        </Button>
                        {selectedPaymentMethod && (
                          <div className="flex-1 flex items-center justify-end">
                            <span className="text-sm text-green-600">
                              ✓ Méthode sélectionnée:{" "}
                              {selectedPaymentMethod === "paypal"
                                ? "PayPal"
                                : selectedPaymentMethod === "mtn"
                                ? "MTN Money"
                                : "Orange Money"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
