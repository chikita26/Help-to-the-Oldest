import { cn } from "@/lib/utils";
import { Button } from "./button";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
  centerScreen?: boolean;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

export function LoadingSpinner({
  size = "md",
  className,
  text,
  centerScreen = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={cn("text-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-b-2 border-primary mx-auto",
          sizeClasses[size],
          text && "mb-4"
        )}
      ></div>
      {text && <p className="text-slate-600 text-sm">{text}</p>}
    </div>
  );

  if (centerScreen) {
    return (
      <div className="min-h-screen bg-warm-gray flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export function LoadingButton({
  isLoading,
  children,
  loadingText = "Chargement...",
  ...props
}: any) {
  return (
    <Button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner size="sm" className="mr-2" />
          {loadingText}
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
