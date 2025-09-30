import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconContentCardProps {
  icon: LucideIcon;
  title: string;
  content: ReactNode;
  iconColor?: string;
  iconBgColor?: string;
  className?: string;
  layout?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: {
    iconWrapper: "w-8 h-8",
    icon: 16,
    title: "text-sm font-medium",
    spacing: "space-x-3",
  },
  md: {
    iconWrapper: "w-10 h-10",
    icon: 20,
    title: "text-base font-semibold",
    spacing: "space-x-4",
  },
  lg: {
    iconWrapper: "w-12 h-12",
    icon: 24,
    title: "text-lg font-semibold",
    spacing: "space-x-4",
  },
};

export function IconContentCard({
  icon: Icon,
  title,
  content,
  iconColor = "text-primary",
  iconBgColor = "bg-primary bg-opacity-10",
  className,
  layout = "horizontal",
  size = "md",
}: IconContentCardProps) {
  const sizeConfig = sizeClasses[size];

  if (layout === "vertical") {
    return (
      <div className={cn("text-center", className)}>
        <div className={cn(
          "rounded-full flex items-center justify-center flex-shrink-0 mx-auto mb-4",
          iconBgColor,
          sizeConfig.iconWrapper
        )}>
          <Icon className={iconColor} size={sizeConfig.icon} />
        </div>
        <h4 className={cn("text-navy mb-2", sizeConfig.title)}>
          {title}
        </h4>
        <div className="text-slate-600">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-start", sizeConfig.spacing, className)}>
      <div className={cn(
        "rounded-full flex items-center justify-center flex-shrink-0",
        iconBgColor,
        sizeConfig.iconWrapper
      )}>
        <Icon className={iconColor} size={sizeConfig.icon} />
      </div>
      <div>
        <h4 className={cn("text-navy mb-1", sizeConfig.title)}>
          {title}
        </h4>
        <div className="text-slate-600">
          {content}
        </div>
      </div>
    </div>
  );
}