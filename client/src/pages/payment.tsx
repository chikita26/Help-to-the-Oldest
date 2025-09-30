import { useState } from "react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import FlutterwavePaymentForm from "@/components/flutterwave-payment-form";

export default function Payment() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  return (
    <div className="min-h-screen scroll-m-3 overflow-auto bg-white">
      <Navigation />
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-8">Make a Donation</h1>
        <div className="max-w-md mx-auto">
          <p className="text-lg mb-8">
            Choose your preferred payment method to support our cause.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <Button
              onClick={() => setSelectedMethod("paypal")}
              variant={selectedMethod === "paypal" ? "default" : "outline"}
            >
              PayPal
            </Button>
            <Button
              onClick={() => setSelectedMethod("mtn")}
              variant={selectedMethod === "mtn" ? "default" : "outline"}
            >
              MTN Mobile Money
            </Button>
            <Button
              onClick={() => setSelectedMethod("orange")}
              variant={selectedMethod === "orange" ? "default" : "outline"}
            >
              Orange Money
            </Button>
          </div>

          <div className="mt-8">
            {selectedMethod === "paypal" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Pay with PayPal</h2>
                <PayPalScriptProvider
                  options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID }}
                >
                  <PayPalButtons
                    createOrder={async (data, actions) => {
                      const res = await fetch("/api/paypal/create-order", {
                        method: "POST",
                      });
                      const order = await res.json();
                      return order.id;
                    }}
                    onApprove={async (data, actions) => {
                      const res = await fetch("/api/paypal/capture-order", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          orderID: data.orderID,
                        }),
                      });
                      const orderData = await res.json();
                      // You can do something with the orderData here, like show a success message
                      console.log(orderData);
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            )}
            {selectedMethod === "mtn" && (
              <div>
                <a
                  href="+237681752051"
                  type="tel"
                  className="text-2xl font-semibold mb-4"
                >
                  Pay with MTN Mobile Money
                </a>
              </div>
            )}
            {selectedMethod === "orange" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Pay with Orange Money
                </h2>
                <a type="tel" href={`*681752051*9*$`}>
                  Pay with Orange
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
