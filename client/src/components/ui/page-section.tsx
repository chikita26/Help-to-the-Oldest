import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageSectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  background?: "white" | "gray" | "primary";
  centered?: boolean;
  maxWidth?: "4xl" | "5xl" | "6xl" | "7xl";
}

const backgroundClasses = {
  white: "bg-white",
  gray: "bg-warm-gray",
  primary: "bg-primary text-white",
};

const maxWidthClasses = {
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
};

export function PageSection({
  id,
  title,
  subtitle,
  children,
  className,
  containerClassName,
  background = "white",
  centered = false,
  maxWidth = "6xl",
}: PageSectionProps) {
  return (
    <section
      id={id}
      className={cn("py-16", backgroundClasses[background], className)}
    >
      <div className={cn("container mx-auto px-4 sm:px-6 lg:px-8", containerClassName)}>
        <div className={cn("mx-auto", maxWidthClasses[maxWidth])}>
          {(title || subtitle) && (
            <div className={cn("mb-16", centered && "text-center")}>
              {title && (
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                  {title}
                </h2>
              )}
              {title && <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>}
              {subtitle && (
                <p className="text-lg text-slate-600">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}