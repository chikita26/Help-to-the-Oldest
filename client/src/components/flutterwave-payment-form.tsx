import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { contacts } from "./contacts.ts";

interface PaymentFormProps {
  method: "MTN" | "ORANGE";
  amount?: string;
  email?: string;
  onSuccess?: () => void;
}

export default function PaymentForm({
  method,
  amount: initialAmount = "",
  email: initialEmail = "",
  onSuccess,
}: PaymentFormProps) {
  const [amount, setAmount] = useState(initialAmount);
  const [email, setEmail] = useState(initialEmail);
  const [phoneNumber, setPhoneNumber] = useState("");

  const { MTN_CONTACT, ORANGE_CONTACT } = contacts;
  return (
    <form className="space-y-4 mt-4">
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="1"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>
      <></>

      <Button
        onClick={() => {
          window.location.replace(
            method == "MTN"
              ? `tel:*126*9*${MTN_CONTACT}*${amount}#`
              : `tel:#150*9*${ORANGE_CONTACT}*{amount}#`
          );
        }}
        disabled={phoneNumber ? false : true}
        aria-disabled={phoneNumber ? true : false}
      >
        <Button>Pay with {method} Mobile Money</Button>
      </Button>
    </form>
  );
}
