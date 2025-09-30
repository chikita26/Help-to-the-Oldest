import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
  PAYMENT_CONFIG,
  generateUSSDCode,
  formatPhoneForDisplay,
} from "@shared/payment-config";
import { Copy, Phone, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Payment() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Code copié !",
      description: "Le code USSD a été copié dans votre presse-papier",
    });
  };

  const dialUSSD = (code: string) => {
    window.location.href = `tel:${code}`;
  };

  return (
    <div className="min-h-screen scroll-m-3 overflow-auto bg-white">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Faire un Don</h1>
            <p className="text-lg text-gray-600">
              Choisissez votre méthode de paiement préférée pour soutenir notre
              cause
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8">
            <Button
              onClick={() => setSelectedMethod("paypal")}
              variant={selectedMethod === "paypal" ? "default" : "outline"}
              className="h-20 text-lg"
            >
              <CreditCard className="mr-3" size={24} />
              PayPal - Paiement International
            </Button>
            <Button
              onClick={() => setSelectedMethod("mtn")}
              variant={selectedMethod === "mtn" ? "default" : "outline"}
              className="h-20 text-lg bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
            >
              <Phone className="mr-3" size={24} />
              MTN Mobile Money
            </Button>
            <Button
              onClick={() => setSelectedMethod("orange")}
              variant={selectedMethod === "orange" ? "default" : "outline"}
              className="h-20 text-lg bg-orange-50 border-orange-200 hover:bg-orange-100"
            >
              <Phone className="mr-3" size={24} />
              Orange Money
            </Button>
          </div>

          {selectedMethod === "paypal" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2" />
                  Paiement PayPal
                </CardTitle>
                <CardDescription>
                  Paiement sécurisé avec PayPal - Accepte les cartes de crédit
                  internationales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PayPalScriptProvider
                  options={{
                    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
                    currency: "USD",
                  }}
                >
                  <PayPalButtons
                    createOrder={async () => {
                      try {
                        const res = await fetch("/api/paypal/create-order", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            amount: amount || "10.00",
                          }),
                        });

                        if (!res.ok) {
                          throw new Error(`HTTP error! status: ${res.status}`);
                        }

                        const order = await res.json();
                        if (!order.id) {
                          throw new Error("Order ID not received from server");
                        }

                        return order.id;
                      } catch (error) {
                        console.error("PayPal create order error:", error);
                        toast({
                          variant: "destructive",
                          title: "Erreur PayPal",
                          description:
                            "Impossible de créer la commande PayPal. Veuillez réessayer.",
                        });
                        throw error;
                      }
                    }}
                    onApprove={async (data) => {
                      try {
                        const res = await fetch("/api/paypal/capture-order", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            orderID: data.orderID,
                          }),
                        });

                        if (!res.ok) {
                          throw new Error(`HTTP error! status: ${res.status}`);
                        }

                        await res.json();
                        toast({
                          title: "Paiement réussi !",
                          description: "Merci pour votre don généreux.",
                        });
                      } catch (error) {
                        console.error("PayPal capture error:", error);
                        toast({
                          variant: "destructive",
                          title: "Erreur de paiement",
                          description:
                            "Le paiement n'a pas pu être traité. Veuillez réessayer.",
                        });
                      }
                    }}
                    onError={(err) => {
                      console.error("PayPal error:", err);
                      toast({
                        variant: "destructive",
                        title: "Erreur PayPal",
                        description: "Une erreur s'est produite avec PayPal.",
                      });
                    }}
                  />
                </PayPalScriptProvider>
              </CardContent>
            </Card>
          )}

          {(selectedMethod === "mtn" || selectedMethod === "orange") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="mr-2" />
                  Paiement{" "}
                  {PAYMENT_CONFIG[selectedMethod as "mtn" | "orange"].name}
                </CardTitle>
                <CardDescription>
                  Payez facilement avec votre mobile money en composant le code
                  USSD
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="amount" className="text-base font-medium">
                    Montant du don (FCFA)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Ex: 5000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-2 text-lg"
                    min="100"
                  />
                </div>

                {amount && parseInt(amount) >= 100 && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Instructions de paiement
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Numéro de l'organisation
                        </Label>
                        <div className="text-xl font-mono">
                          {formatPhoneForDisplay(
                            PAYMENT_CONFIG[selectedMethod as "mtn" | "orange"]
                              .phone
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Code USSD à composer
                        </Label>
                        <div className="flex items-center gap-2 mt-2">
                          <code className="bg-white px-4 py-3 rounded-lg text-lg font-mono border flex-1">
                            {generateUSSDCode(
                              selectedMethod as "mtn" | "orange",
                              amount
                            )}
                          </code>
                          <Button
                            onClick={() =>
                              copyToClipboard(
                                generateUSSDCode(
                                  selectedMethod as "mtn" | "orange",
                                  amount
                                )
                              )
                            }
                            variant="outline"
                            size="sm"
                          >
                            <Copy size={16} />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button
                          onClick={() =>
                            dialUSSD(
                              generateUSSDCode(
                                selectedMethod as "mtn" | "orange",
                                amount
                              )
                            )
                          }
                          className={
                            selectedMethod === "mtn"
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-orange-500 hover:bg-orange-600"
                          }
                        >
                          <Phone className="mr-2" size={16} />
                          Composer automatiquement
                        </Button>
                        <Button
                          onClick={() =>
                            copyToClipboard(
                              generateUSSDCode(
                                selectedMethod as "mtn" | "orange",
                                amount
                              )
                            )
                          }
                          variant="outline"
                        >
                          <Copy className="mr-2" size={16} />
                          Copier le code
                        </Button>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Étapes à suivre :
                        </h4>
                        <ol className="list-decimal list-inside space-y-1 text-blue-800">
                          {PAYMENT_CONFIG[
                            selectedMethod as "mtn" | "orange"
                          ].instructions.map((instruction, index) => (
                            <li key={index} className="text-sm">
                              {instruction}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                )}

                {amount && parseInt(amount) < 100 && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-red-800 text-sm">
                      Le montant minimum pour un don est de 100 FCFA
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!selectedMethod && (
            <Card className="bg-gray-50">
              <CardContent className="py-12 text-center">
                <p className="text-gray-600 text-lg">
                  Sélectionnez une méthode de paiement ci-dessus pour continuer
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
