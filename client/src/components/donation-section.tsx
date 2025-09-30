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
import { Form } from "@/components/ui/form";
import {
  TextFormField,
  TextareaFormField,
  SelectFormField,
} from "@/components/ui/form-field-wrapper";
import { LoadingButton } from "@/components/ui/loading-spinner";
import { PageSection } from "@/components/ui/page-section";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertDonationSchema, type InsertDonation } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { Check, Phone, Clock, Users } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
  PAYMENT_CONFIG,
  generateUSSDCode,
  DONATION_CONTACT_CONFIG,
  formatPhoneForDisplay,
} from "@shared/payment-config";

export default function DonationSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<
    "form" | "payment" | "contact"
  >("form");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [donationData, setDonationData] = useState<InsertDonation | null>(null);
  const { toast } = useToast();
  const { handleApiError } = useErrorHandler();

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

  // Watch the donation type to update field labels dynamically
  const donationType = form.watch("type");

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
    onError: (error) => {
      handleApiError(error, "donation");
    },
  });

  const onSubmit = (data: InsertDonation) => {
    // Set donation data for both types
    setDonationData(data);

    if (data.type === "monetary") {
      // Proceed to payment step for monetary donations
      setPaymentStep("payment");
    } else {
      // Proceed to contact step for in-kind donations
      setPaymentStep("contact");
    }
  };

  const handlePaymentSuccess = () => {
    if (donationData) {
      donationMutation.mutate(donationData);
    }
  };

  const handleContactConfirmed = () => {
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

  const donationTypeOptions = [
    { value: "monetary", label: "Don monétaire" },
    { value: "nature", label: "Don en nature" },
  ];

  return (
    <PageSection
      id="don"
      title="Faire un Don"
      subtitle="Votre générosité peut changer la vie d'une personne âgée"
      background="white"
      centered
    >
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-navy mb-6">
            Pourquoi donner ?
          </h3>
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="text-white text-sm" size={16} />
                </div>
                <p className="text-slate-700 text-sm md:text-base">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-warm-gray p-6 md:p-8 rounded-xl">
          <h3 className="text-lg md:text-xl font-semibold text-navy mb-6">
            Modalités de Don
          </h3>
          <div className="space-y-4">
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
            className="w-full bg-secondary hover:bg-orange-600 text-white py-3 px-4 md:px-6 rounded-lg font-semibold mt-6 transition-colors text-sm md:text-base"
          >
            Faire un Don Maintenant
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={resetDialog}>
            <DialogContent
              className="max-w-2xl max-h-[95vh] overflow-y-auto mx-4 md:mx-auto"
              key={paymentStep}
            >
              <DialogHeader>
                <DialogTitle>
                  {paymentStep === "form"
                    ? "Formulaire de Don"
                    : paymentStep === "payment"
                    ? "Choisir le mode de paiement"
                    : "Coordination du don"}
                </DialogTitle>
                <DialogDescription>
                  {paymentStep === "form"
                    ? "Remplissez vos informations pour faire un don à notre organisation."
                    : paymentStep === "payment"
                    ? "Sélectionnez votre méthode de paiement préférée pour finaliser votre don."
                    : "Contactez-nous pour organiser la remise de votre don en nature."}
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
                      paymentStep === "payment" || paymentStep === "contact"
                        ? "bg-blue-300"
                        : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`flex items-center ${
                      paymentStep === "payment" || paymentStep === "contact"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        paymentStep === "payment" || paymentStep === "contact"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      2
                    </div>
                    <span className="ml-2 text-sm font-medium">
                      {donationData?.type === "monetary"
                        ? "Paiement"
                        : "Contact"}
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
                    <TextFormField
                      control={form.control}
                      name="donorName"
                      label="Nom complet"
                      placeholder="Votre nom complet"
                      required
                    />

                    <TextFormField
                      control={form.control}
                      name="email"
                      label="Email"
                      type="email"
                      placeholder="votre.email@exemple.com"
                      required
                    />

                    <SelectFormField
                      control={form.control}
                      name="type"
                      label="Type de don"
                      options={donationTypeOptions}
                      placeholder="Sélectionnez le type de don"
                      required
                    />

                    <TextFormField
                      control={form.control}
                      name="amount"
                      label={
                        donationType === "monetary"
                          ? "Montant (FCFA)"
                          : "Description (optionnel)"
                      }
                      placeholder={
                        donationType === "monetary"
                          ? "Ex: 50000"
                          : "Ex: Médicaments pour diabète, ou contactez-nous directement"
                      }
                      required={donationType === "monetary"}
                    />

                    <TextareaFormField
                      control={form.control}
                      name="message"
                      label="Message (optionnel)"
                      placeholder="Un message d'encouragement..."
                      rows={3}
                    />

                    <LoadingButton
                      type="submit"
                      className="w-full bg-secondary hover:bg-orange-600"
                      isLoading={donationMutation.isPending}
                      loadingText="Enregistrement..."
                    >
                      {form.watch("type") === "monetary"
                        ? "Continuer vers le paiement"
                        : "Confirmer le Don"}
                    </LoadingButton>
                  </form>
                </Form>
              ) : paymentStep === "payment" ? (
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
                      Sélectionnez la méthode de paiement qui vous convient le
                      mieux
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
                        selectedPaymentMethod === "mtn" ? "default" : "outline"
                      }
                      className="flex items-center justify-between p-4 h-auto"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-yellow-500 rounded mr-3 flex items-center justify-center text-white text-sm font-bold">
                          MTN
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">MTN Mobile Money</div>
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
                            try {
                              const res = await fetch(
                                "/api/paypal/create-order",
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    amount: donationData?.amount || "10.00",
                                  }),
                                }
                              );

                              if (!res.ok) {
                                throw new Error(
                                  `HTTP error! status: ${res.status}`
                                );
                              }

                              const order = await res.json();
                              if (!order.id) {
                                throw new Error(
                                  "Order ID not received from server"
                                );
                              }

                              return order.id;
                            } catch (error) {
                              console.error(
                                "PayPal create order error:",
                                error
                              );
                              handleApiError(error, "payment");
                              throw error;
                            }
                          }}
                          onApprove={async (data) => {
                            try {
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

                              if (!res.ok) {
                                throw new Error(
                                  `HTTP error! status: ${res.status}`
                                );
                              }

                              await res.json();
                              toast({
                                title: "Paiement réussi !",
                                description:
                                  "Votre don a été traité avec succès.",
                              });
                              handlePaymentSuccess();
                            } catch (error) {
                              console.error("PayPal capture error:", error);
                              handleApiError(error, "payment");
                            }
                          }}
                          onError={(err) => {
                            console.error("PayPal error:", err);
                            handleApiError(err, "payment");
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
                            {selectedPaymentMethod === "mtn" ? "MTN" : "Orange"}{" "}
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
                          <h4 className="font-medium mb-2">
                            Code USSD à composer :
                          </h4>
                          <code className="text-lg font-mono bg-gray-100 px-3 py-2 rounded block">
                            {generateUSSDCode(
                              selectedPaymentMethod === "mtn"
                                ? "mtn"
                                : "orange",
                              donationData?.amount || ""
                            )}
                          </code>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p className="mb-2">Instructions :</p>
                          <ol className="list-decimal list-inside space-y-1">
                            {PAYMENT_CONFIG[
                              selectedPaymentMethod === "mtn" ? "mtn" : "orange"
                            ].instructions.map((instruction, index) => (
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
                        Veuillez sélectionner une méthode de paiement ci-dessus
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
              ) : (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">
                        Récapitulatif de votre don
                      </h3>
                      {donationData?.amount && (
                        <p className="text-xl font-bold text-green-900 mb-2">
                          {donationData.amount}
                        </p>
                      )}
                      <p className="text-sm text-green-700">
                        Donateur: {donationData?.donorName}
                      </p>
                      <p className="text-sm text-green-700">
                        Email: {donationData?.email}
                      </p>
                    </div>

                    <h3 className="text-xl font-semibold text-navy mb-4">
                      Coordination de votre don en nature
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Contactez-nous pour organiser la remise de votre don
                    </p>
                  </div>

                  {/* Contact Information Cards */}
                  <div className="space-y-4">
                    {/* Primary Contact */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-full mr-3 flex items-center justify-center text-white">
                          <Phone size={20} />
                        </div>
                        <div>
                          <h4 className="text-base md:text-lg font-semibold text-blue-900">
                            Contact Principal
                          </h4>
                          <p className="text-xs md:text-sm text-blue-700">
                            {DONATION_CONTACT_CONFIG.primaryContact.name}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm md:text-base">
                          <Phone size={16} className="mr-2 text-blue-600" />
                          <a
                            href={`tel:+237${DONATION_CONTACT_CONFIG.primaryContact.phone}`}
                            className="font-mono font-semibold text-blue-900 hover:text-blue-700"
                          >
                            {formatPhoneForDisplay(
                              DONATION_CONTACT_CONFIG.primaryContact.phone
                            )}
                          </a>
                        </div>
                        <div className="flex items-center text-xs md:text-sm text-blue-700">
                          <Clock size={14} className="mr-2" />
                          {DONATION_CONTACT3_CONFIG.primaryContact.availability}
                        </div>
                      </div>
                    </div>

                    {/* Secondary Contact */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 md:p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-orange-600 rounded-full mr-3 flex items-center justify-center text-white">
                          <Users size={20} />
                        </div>
                        <div>
                          <h4 className="text-base md:text-lg font-semibold text-orange-900">
                            Contact Alternatif
                          </h4>
                          <p className="text-xs md:text-sm text-orange-700">
                            {DONATION_CONTACT_CONFIG.secondaryContact.name}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm md:text-base">
                          <Phone size={16} className="mr-2 text-orange-600" />
                          <a
                            href={`tel:+237${DONATION_CONTACT_CONFIG.secondaryContact.phone}`}
                            className="font-mono font-semibold text-orange-900 hover:text-orange-700"
                          >
                            {formatPhoneForDisplay(
                              DONATION_CONTACT_CONFIG.secondaryContact.phone
                            )}
                          </a>
                        </div>
                        <div className="flex items-center text-xs md:text-sm text-orange-700">
                          <Clock size={14} className="mr-2" />
                          {
                            DONATION_CONTACT_CONFIG.secondaryContact
                              .availability
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
                    <h4 className="font-semibold mb-3 text-navy">
                      Instructions importantes :
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {DONATION_CONTACT_CONFIG.instructions.general.map(
                        (instruction, index) => (
                          <li key={index}>{instruction}</li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 border-t">
                    <Button
                      onClick={() => setPaymentStep("form")}
                      variant="outline"
                      className="flex-1 text-sm md:text-base"
                    >
                      ← Retour au formulaire
                    </Button>
                    <LoadingButton
                      onClick={handleContactConfirmed}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm md:text-base"
                      isLoading={donationMutation.isPending}
                      loadingText="Enregistrement..."
                    >
                      J'ai noté les informations
                    </LoadingButton>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </PageSection>
  );
}
