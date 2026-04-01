import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Dumbbell, Timer, Zap } from "lucide-react";

import type { GetWorkoutPlan200WorkoutDaysItem } from "@/app/_lib/api/fetch-generated";
import {
  getWorkoutDayDurationLabel,
  getWorkoutDayPath,
} from "@/app/_lib/workout-day";
import {
  getWorkoutPlanDayImageUrl,
  getWorkoutPlanDayWeekDayLabel,
} from "@/app/_lib/workout-plan";

type WorkoutPlanDayCardProps = {
  workoutDay: GetWorkoutPlan200WorkoutDaysItem;
  workoutPlanId: string;
};

const WorkoutPlanDayCard = ({
  workoutDay,
  workoutPlanId,
}: WorkoutPlanDayCardProps) => {
  if (workoutDay.isRest) {
    return (
      <Link
        className="flex h-[110px] flex-col justify-between rounded-[12px] bg-home-surface-border p-5"
        href={getWorkoutDayPath(workoutPlanId, workoutDay.id)}
      >
        <div className="inline-flex w-fit items-center justify-center gap-1 rounded-full bg-workout-plan-rest-chip px-[10px] py-[5px]">
          <CalendarDays className="size-[14px] text-foreground" />
          <span className="text-[12px] font-semibold leading-none text-foreground uppercase">
            {getWorkoutPlanDayWeekDayLabel(workoutDay.weekDay)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Zap className="size-5 fill-primary text-primary" />
          <span className="text-[24px] font-semibold leading-[1.05] text-foreground">
            Descanso
          </span>
        </div>
      </Link>
    );
  }

  const imageUrl = getWorkoutPlanDayImageUrl(workoutDay);

  return (
    <Link
      className="relative flex h-[200px] flex-col justify-between overflow-hidden rounded-[12px] p-5"
      href={getWorkoutDayPath(workoutPlanId, workoutDay.id)}
    >
      {imageUrl ? (
        <Image
          alt={`Treino ${workoutDay.name}`}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 350px"
          src={imageUrl}
        />
      ) : null}
      <div className="absolute inset-0 bg-home-workout-overlay" />

      <div className="relative z-10">
        <div className="inline-flex items-center justify-center gap-1 rounded-full bg-home-chip px-[10px] py-[5px] backdrop-blur-[4px]">
          <CalendarDays className="size-[14px] text-primary-foreground" />
          <span className="text-[12px] font-semibold leading-none text-primary-foreground uppercase">
            {getWorkoutPlanDayWeekDayLabel(workoutDay.weekDay)}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-2">
        <h2 className="text-[24px] font-semibold leading-[1.05] text-primary-foreground">
          {workoutDay.name}
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
              {workoutDay.exercisesCount} exercícios
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WorkoutPlanDayCard;

