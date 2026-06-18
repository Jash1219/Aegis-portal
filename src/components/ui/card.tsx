import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  innerGlow?: boolean;
  criticalGlow?: boolean;
}

export function Card({
  children,
  className,
  innerGlow = false,
  criticalGlow = false,
}: CardProps) {
  return (
    <div
      className={cn(
        "surface-card rounded-lg surface-interactive",
        innerGlow && "inner-glow",
        criticalGlow && "critical-glow",
        className,
      )}
    >
      {children}
    </div>
  );
}
