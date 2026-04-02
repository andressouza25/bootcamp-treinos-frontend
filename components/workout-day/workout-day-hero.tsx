import Image from "next/image";
import { CalendarDays, Dumbbell, Timer } from "lucide-react";
import type { ReactNode } from "react";

import type { GetWorkoutDays200 } from "@/app/_lib/api/fetch-generated";
import {
  getWorkoutDayDisplayName,
  getWorkoutDayDurationLabel,
  getWorkoutDayWeekDayLabel,
  workoutDayFallbackImageUrl,
} from "@/app/_lib/workout-day";
import { Button } from "@/components/ui/button";

type WorkoutDayHeroProps = {
  action?: ReactNode;
  workoutDay: GetWorkoutDays200;
};

const WorkoutDayHero = ({ action, workoutDay }: WorkoutDayHeroProps) => {
  const displayName = getWorkoutDayDisplayName(workoutDay.name);

  return (
    <section className="relative flex h-[200px] flex-col justify-between overflow-hidden rounded-[12px] p-5">
      <Image
        alt={`Treino ${displayName}`}
        className="object-cover"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 350px"
        src={workoutDay.coverImageUrl ?? workoutDayFallbackImageUrl}
      />
      <div className="absolute inset-0 bg-home-workout-overlay" />

      <div className="relative z-10">
        <div className="inline-flex items-center justify-center gap-1 rounded-full bg-home-chip px-[10px] py-[5px] backdrop-blur-[4px]">
          <CalendarDays className="size-[14px] text-primary-foreground" />
          <span className="text-[12px] font-semibold leading-none text-primary-foreground">
            {getWorkoutDayWeekDayLabel(workoutDay.weekDay)}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-[24px] font-semibold leading-[1.05] text-primary-foreground">
            {displayName}
          </h2>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Timer className="size-[14px] text-home-workout-meta" />
              <span className="text-[12px] leading-[1.4] text-home-workout-meta">
                {getWorkoutDayDurationLabel(workoutDay.estimatedDurationInSeconds)}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Dumbbell className="size-[14px] text-home-workout-meta" />
              <span className="text-[12px] leading-[1.4] text-home-workout-meta">
                {workoutDay.exercises.length} exercícios
              </span>
            </div>
          </div>
        </div>

        {action}
      </div>
    </section>
  );
};

export const WorkoutDayHeroActionButton = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <Button
      className="h-10 rounded-full px-4 text-[14px] font-semibold leading-none text-primary-foreground shadow-none hover:bg-primary"
      type="submit"
    >
      {children}
    </Button>
  );
};

export default WorkoutDayHero;
