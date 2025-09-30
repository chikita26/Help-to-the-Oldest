export const PAYMENT_CONFIG = {
  mtn: {
    name: "MTN Mobile Money",
    phone: "679395853",
    ussdCode: "*126*9*{phone}*{amount}#",
    color: "yellow",
    instructions: [
      "Composez le code USSD généré",
      "Confirmez le montant",
      "Entrez votre code PIN MTN",
      "Confirmez la transaction",
      "nom du bénéficiaire: MENGUE CLaudel Florentin",
    ],
  },
  orange: {
    name: "Orange Money",
    phone: "695842668",
    ussdCode: "#150*11*{phone}#",
    color: "orange",
    instructions: [
      "Composez le code USSD généré",
      "Confirmez le montant",
      "Entrez votre code PIN Orange",
      "Confirmez la transaction",
      "nom du bénéficiaire: MENGUE CLaudel Florentin",
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
