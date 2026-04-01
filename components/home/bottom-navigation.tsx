import {
  CalendarDays,
  ChartColumn,
  Home,
  Sparkles,
  UserRound,
} from "lucide-react";

import { getHomeData } from "@/app/_lib/api/fetch-generated";
import { getServerSession } from "@/app/_lib/get-server-session";
import { getTodayDate } from "@/app/_lib/home";
import OpenChatButton from "@/components/chat/open-chat-button";
import BottomNavigationItem from "@/components/home/bottom-navigation-item";

type BottomNavigationProps = {
  activeItem?: "calendar" | "home" | "profile" | "sparkles" | "stats";
};

export default async function BottomNavigation({
  activeItem = "sparkles",
}: BottomNavigationProps) {
  const session = await getServerSession();
  let calendarHref: string | undefined;

  if (session?.session.userId) {
    const homeDataResponse = await getHomeData(getTodayDate(), {
      cache: "no-store",
    });

    if (homeDataResponse.status === 200) {
      calendarHref = `/workout-plans/${homeDataResponse.data.activeWorkoutPlanId}`;
    }
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-[393px] items-center justify-center gap-6 rounded-t-[20px] border border-home-surface-border bg-background px-6 py-4">
      <BottomNavigationItem
        activeStyle={activeItem === "home" ? "muted" : undefined}
        href="/"
        icon={Home}
      />
      <BottomNavigationItem
        activeStyle={activeItem === "calendar" ? "muted" : undefined}
        href={calendarHref}
        icon={CalendarDays}
      />
      <OpenChatButton
        ariaLabel="Abrir coach AI"
        className="size-14 rounded-full bg-primary p-4 text-primary-foreground hover:bg-primary"
        size="icon"
      >
        <Sparkles className="size-6" />
      </OpenChatButton>
      <BottomNavigationItem
        activeStyle={activeItem === "stats" ? "foreground" : undefined}
        href="/stats"
        icon={ChartColumn}
      />
      <BottomNavigationItem
        activeStyle={activeItem === "profile" ? "foreground" : undefined}
        href="/profile"
        icon={UserRound}
      />
    </nav>
  );
}
