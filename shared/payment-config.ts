export const PAYMENT_CONFIG = {
  mtn: {
    name: "MTN Mobile Money",
    phone: "681752051",
    ussdCode: "*126*9*{phone}*{amount}#",
    color: "yellow",
    instructions: [
      "Composez le code USSD généré",
      "Confirmez le montant",
      "Entrez votre code PIN MTN",
      "Confirmez la transaction",
    ],
  },
  orange: {
    name: "Orange Money",
    phone: "681752051",
    ussdCode: "*130*{phone}*{amount}#",
    color: "orange",
    instructions: [
      "Composez le code USSD généré",
      "Confirmez le montant",
      "Entrez votre code PIN Orange",
      "Confirmez la transaction",
    ],
  },
  paypal: {
    name: "PayPal",
  },
} as const;

export type PaymentMethod = keyof typeof PAYMENT_CONFIG;

export function generateUSSDCode(
  method: "mtn" | "orange",
  amount: string
): string {
  const config = PAYMENT_CONFIG[method];
  return config.ussdCode
    .replace("{phone}", config.phone)
    .replace("{amount}", amount);
}

export function formatPhoneForDisplay(phone: string): string {
  return `+237 ${phone}`;
}
