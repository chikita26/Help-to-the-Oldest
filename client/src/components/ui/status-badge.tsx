import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "monetary"
  | "nature";

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-800 border-gray-200",
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-orange-100 text-orange-800 border-orange-200",
  danger: "bg-red-100 text-red-800 border-red-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
  monetary: "bg-emerald-100 text-emerald-800 border-emerald-200",
  nature: "bg-amber-100 text-amber-800 border-amber-200",
};

export function StatusBadge({
  children,
  variant = "default",
  className
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Pre-made badge components for common uses
export function DonationTypeBadge({ type }: { type: string }) {
  if (type === "monetary") {
    return (
      <StatusBadge variant="monetary">
        💰 Don monétaire
      </StatusBadge>
    );
  }
  return (
    <StatusBadge variant="nature">
      📦 Don en nature
    </StatusBadge>
  );
}

export function AvailabilityBadge({ availability }: { availability: string }) {
  const labels: Record<string, string> = {
    weekend: "🗓️ Week-ends",
    evenings: "⏰ Soirées",
    flexible: "✨ Flexible",
    "full-time": "⏱️ Temps plein",
  };

  return (
    <StatusBadge variant="info">
      {labels[availability] || availability}
    </StatusBadge>
  );
}

export function SubjectBadge({ subject }: { subject: string }) {
  const config: Record<string, { label: string; variant: BadgeVariant }> = {
    volontariat: { label: "Volontariat", variant: "info" },
    don: { label: "Don", variant: "success" },
    partenariat: { label: "Partenariat", variant: "warning" },
    information: { label: "Information", variant: "default" },
    autre: { label: "Autre", variant: "default" },
  };

  const { label, variant } = config[subject] || {
    label: subject,
    variant: "default" as BadgeVariant
  };

  return <StatusBadge variant={variant}>{label}</StatusBadge>;
}