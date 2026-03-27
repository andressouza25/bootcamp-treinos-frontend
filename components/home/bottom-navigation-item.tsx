import Link from "next/link";
import type { ComponentType } from "react";

import { Button } from "@/components/ui/button";

type BottomNavigationItemProps = {
  href?: string;
  icon: ComponentType<{ className?: string }>;
  activeStyle?: "filled" | "foreground" | "muted";
};

export default function BottomNavigationItem({
  href,
  icon: Icon,
  activeStyle,
}: BottomNavigationItemProps) {
  if (activeStyle === "filled" && href) {
    return (
      <Button
        asChild
        className="size-14 rounded-full bg-primary p-4 text-primary-foreground hover:bg-primary"
        size="icon"
      >
        <Link href={href}>
          <Icon className="size-6" />
        </Link>
      </Button>
    );
  }

  if (activeStyle === "filled") {
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

  if (activeStyle === "muted" && href) {
    return (
      <Button
        asChild
        className="size-12 rounded-full p-3 text-home-week-label hover:bg-transparent hover:text-home-week-label"
        size="icon"
        variant="ghost"
      >
        <Link href={href}>
          <Icon className="size-6" />
        </Link>
      </Button>
    );
  }

  if (activeStyle === "muted") {
    return (
      <Button
        className="size-12 rounded-full p-3 text-home-week-label hover:bg-transparent hover:text-home-week-label"
        size="icon"
        type="button"
        variant="ghost"
      >
        <Icon className="size-6" />
      </Button>
    );
  }

  if (activeStyle === "foreground" && href) {
    return (
      <Button
        asChild
        className="size-12 rounded-full p-3 text-foreground hover:bg-transparent hover:text-foreground"
        size="icon"
        variant="ghost"
      >
        <Link href={href}>
          <Icon className="size-6" />
        </Link>
      </Button>
    );
  }

  if (activeStyle === "foreground") {
    return (
      <Button
        className="size-12 rounded-full p-3 text-foreground hover:bg-transparent hover:text-foreground"
        size="icon"
        type="button"
        variant="ghost"
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
