import { CircleQuestionMark, Zap } from "lucide-react";

import type { GetWorkoutDays200ExercisesItem } from "@/app/_lib/api/fetch-generated";
import {
  getExerciseRepsLabel,
  getExerciseRestLabel,
  getExerciseSetsLabel,
} from "@/app/_lib/workout-day";
import { Button } from "@/components/ui/button";
import WorkoutDayExerciseChip from "@/components/workout-day/workout-day-exercise-chip";

type WorkoutDayExerciseCardProps = {
  exercise: GetWorkoutDays200ExercisesItem;
};

const WorkoutDayExerciseCard = ({ exercise }: WorkoutDayExerciseCardProps) => {
  return (
    <article className="flex min-h-[88px] flex-col justify-center gap-3 rounded-[12px] border border-home-surface-border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[16px] font-semibold leading-[1.4] text-foreground">
          {exercise.name}
        </h2>

        <Button
          className="size-5 p-0 text-home-week-label hover:bg-transparent hover:text-home-week-label"
          size="icon-xs"
          type="button"
          variant="ghost"
        >
          <CircleQuestionMark className="size-5" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-[6px]">
        <WorkoutDayExerciseChip>
          {getExerciseSetsLabel(exercise.sets)}
        </WorkoutDayExerciseChip>
        <WorkoutDayExerciseChip>
          {getExerciseRepsLabel(exercise.reps)}
        </WorkoutDayExerciseChip>
        <WorkoutDayExerciseChip
          icon={<Zap className="size-[14px] text-home-week-label" />}
        >
          {getExerciseRestLabel(exercise.restTimeInSeconds)}
        </WorkoutDayExerciseChip>
      </div>
    </article>
  );
};

export default WorkoutDayExerciseCard;

