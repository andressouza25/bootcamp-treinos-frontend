"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const WorkoutDayBackButton = () => {
  const router = useRouter();

  return (
    <Button
      className="size-6 p-0 text-foreground hover:bg-transparent hover:text-foreground"
      onClick={() => router.back()}
      size="icon-xs"
      type="button"
      variant="ghost"
    >
      <ChevronLeft className="size-6" />
    </Button>
  );
};

export default WorkoutDayBackButton;

