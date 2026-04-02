import dayjs from "dayjs";

import type {
  GetWorkoutDays200ExercisesItem,
  GetWorkoutDays200SessionsItem,
} from "@/app/_lib/api/fetch-generated";
import { getWeekDayName } from "@/app/_lib/home";

export const workoutDayFallbackImageUrl = "/home/today-workout.png";

export const getWorkoutDayPath = (workoutPlanId: string, workoutDayId: string) =>
  `/workout-plans/${workoutPlanId}/days/${workoutDayId}`;

export const getWorkoutDayDurationLabel = (
  estimatedDurationInSeconds: number,
) => {
  const totalMinutes = Math.max(1, Math.round(estimatedDurationInSeconds / 60));

  return `${totalMinutes}min`;
};

export const getWorkoutDayWeekDayLabel = (weekDay: Parameters<typeof getWeekDayName>[0]) =>
  getWeekDayName(weekDay);

const normalizedWeekDayLikeNames = new Set([
  "segunda",
  "segunda-feira",
  "terca",
  "terca-feira",
  "quarta",
  "quarta-feira",
  "quinta",
  "quinta-feira",
  "sexta",
  "sexta-feira",
  "sabado",
  "domingo",
  "feira",
  "treino segunda-feira",
  "treino terca-feira",
  "treino quarta-feira",
  "treino quinta-feira",
  "treino sexta-feira",
  "treino sabado",
  "treino domingo",
]);

export const getWorkoutDayDisplayName = (name: string) => {
  const normalizedName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  if (normalizedWeekDayLikeNames.has(normalizedName)) {
    return "Treino";
  }

  return name;
};

export const getExerciseSetsLabel = (sets: GetWorkoutDays200ExercisesItem["sets"]) =>
  `${sets} SERIES`;

export const getExerciseRepsLabel = (reps: GetWorkoutDays200ExercisesItem["reps"]) =>
  `${reps} REPS`;

export const getExerciseRestLabel = (
  restTimeInSeconds: GetWorkoutDays200ExercisesItem["restTimeInSeconds"],
) => `${restTimeInSeconds}S`;

export const getWorkoutSessionState = (
  sessions: GetWorkoutDays200SessionsItem[],
) => {
  const completedSession = sessions.find((session) => Boolean(session.completedAt));
  const inProgressSession = sessions.find((session) => !session.completedAt);

  return {
    completedSession,
    hasCompletedSession: Boolean(completedSession),
    hasInProgressSession: Boolean(inProgressSession),
    inProgressSession,
  };
};

export const getWorkoutSessionCompletedAt = () => dayjs().toISOString();
