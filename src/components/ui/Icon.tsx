import { icons, type LucideProps } from "lucide-react";

type IconName = keyof typeof icons;

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const LucideIcon = icons[name as IconName];
  if (!LucideIcon) return null;
  return <LucideIcon {...props} />;
}
