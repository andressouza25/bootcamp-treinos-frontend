import {
  CalendarDays,
  ChartColumn,
  Home,
  Sparkles,
  UserRound,
} from "lucide-react";

import BottomNavigationItem from "@/components/home/bottom-navigation-item";

export default function BottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-[393px] items-center justify-center gap-6 rounded-t-[20px] border border-home-surface-border bg-background px-6 py-4">
      <BottomNavigationItem href="/" icon={Home} />
      <BottomNavigationItem icon={CalendarDays} />
      <BottomNavigationItem icon={Sparkles} isActive />
      <BottomNavigationItem icon={ChartColumn} />
      <BottomNavigationItem icon={UserRound} />
    </nav>
  );
}
