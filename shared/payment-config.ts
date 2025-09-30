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

export const DONATION_CONTACT_CONFIG = {
  primaryContact: {
    name: "MENGUE Claude Florentin",
    phone: "679395853",
    availability: "Lundi - Vendredi: 8h - 18h",
  },
  secondaryContact: {
    name: "Équipe HELP To OLDEST",
    phone: "695842668",
    availability: "Samedi - Dimanche: 9h - 17h",
  },
  emergencyContact: {
    name: "Service d'urgence",
    phone: "655215822",
    availability: "24h/24 pour urgences médicales",
  },
  instructions: {
    general: [
      "Contactez-nous pour convenir d'un lieu et d'une heure de remise",
      "Préparez une liste détaillée des articles à donner",
      "Assurez-vous que les médicaments ne sont pas périmés",
      "Les denrées alimentaires doivent être dans leur emballage d'origine",
    ],
    medicalSupplies: [
      "Vérifiez les dates d'expiration",
      "Gardez les médicaments dans leur emballage d'origine",
      "Fournissez la liste des médicaments avec les dosages",
      "Contactez-nous en priorité pour les dons urgents",
    ],
    food: [
      "Produits non périmés uniquement",
      "Emballages non ouverts",
      "Privilégiez les aliments de base (riz, huile, etc.)",
      "Respectez la chaîne du froid pour les produits frais",
    ],
    equipment: [
      "Équipements en bon état de fonctionnement",
      "Fournissez les manuels d'utilisation si disponibles",
      "Nettoyage et désinfection préalables requis",
      "Photos des équipements appréciées pour évaluation",
    ],
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
