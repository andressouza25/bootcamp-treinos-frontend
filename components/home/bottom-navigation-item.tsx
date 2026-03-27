import Link from "next/link";
import type { ComponentType } from "react";

import { Button } from "@/components/ui/button";

type BottomNavigationItemProps = {
  href?: string;
  icon: ComponentType<{ className?: string }>;
  isActive?: boolean;
};

export default function BottomNavigationItem({
  href,
  icon: Icon,
  isActive = false,
}: BottomNavigationItemProps) {
  if (isActive) {
    return (
      <Button
        className="size-14 rounded-full bg-primary p-4 text-primary-foreground hover:bg-primary"
        size="icon"
        type="button"
      >
        <Icon className="size-6" />
      </Button>
    );
  }

  if (href) {
    return (
      <Button
        asChild
        className="size-12 rounded-full p-3 text-home-nav-icon hover:bg-transparent hover:text-home-nav-icon"
        size="icon"
        variant="ghost"
      >
        <Link href={href}>
          <Icon className="size-6" />
        </Link>
      </Button>
    );
  }

  return (
    <Button
      className="size-12 rounded-full p-3 text-home-nav-icon hover:bg-transparent hover:text-home-nav-icon"
      size="icon"
      type="button"
      variant="ghost"
    >
      <Icon className="size-6" />
    </Button>
  );
}
