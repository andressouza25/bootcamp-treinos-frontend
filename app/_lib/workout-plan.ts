import type {
  GetWorkoutPlan200WorkoutDaysItem,
  GetWorkoutPlan200WorkoutDaysItemWeekDay,
} from "@/app/_lib/api/fetch-generated";
import { getWeekDayName, orderedWeekDays } from "@/app/_lib/home";

const workoutPlanImageByWeekDay: Partial<
  Record<GetWorkoutPlan200WorkoutDaysItemWeekDay, string>
> = {
  MONDAY: "/workout-plans/workout-day-monday.png",
  THURSDAY: "/workout-plans/workout-day-thursday.png",
  TUESDAY: "/workout-plans/workout-day-tuesday.png",
  FRIDAY: "/workout-plans/workout-day-friday.png",
};

export const workoutPlanBannerImageUrl = "/workout-plans/workout-plan-banner.png";

export const getWorkoutPlanDayImageUrl = (
  workoutDay: GetWorkoutPlan200WorkoutDaysItem,
) => workoutDay.coverImageUrl ?? workoutPlanImageByWeekDay[workoutDay.weekDay];

export const getWorkoutPlanDays = (
  workoutDays: GetWorkoutPlan200WorkoutDaysItem[],
) => {
  const weekDayOrder = new Map(
    orderedWeekDays.map((weekDay, index) => [weekDay, index]),
  );

  return [...workoutDays].sort(
    (left, right) =>
      (weekDayOrder.get(left.weekDay) ?? Number.MAX_SAFE_INTEGER) -
      (weekDayOrder.get(right.weekDay) ?? Number.MAX_SAFE_INTEGER),
  );
};

export const getWorkoutPlanBadgeLabel = (workoutPlanName: string) =>
  workoutPlanName.toUpperCase();

export const getWorkoutPlanDayWeekDayLabel = (
  weekDay: GetWorkoutPlan200WorkoutDaysItemWeekDay,
) => getWeekDayName(weekDay);

