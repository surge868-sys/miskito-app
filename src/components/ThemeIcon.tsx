import {
  CloudSun,
  Hand,
  Hash,
  ShoppingBasket,
  Sparkles,
  Stethoscope,
  Users,
  Utensils,
  Waves,
  type LucideProps,
} from "lucide-react";

const icons: Record<string, React.ComponentType<LucideProps>> = {
  hand: Hand,
  users: Users,
  basket: ShoppingBasket,
  utensils: Utensils,
  waves: Waves,
  stethoscope: Stethoscope,
  cloudsun: CloudSun,
  hash: Hash,
};

export function ThemeIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = icons[name] ?? Sparkles;
  return <Icon {...props} />;
}
