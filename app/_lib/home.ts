import dayjs from "dayjs";

import type { GetHomeData200TodayWorkoutDayWeekDay } from "@/app/_lib/api/fetch-generated";

const weekDays = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const satisfies readonly GetHomeData200TodayWorkoutDayWeekDay[];

const weekDayLabels: Record<GetHomeData200TodayWorkoutDayWeekDay, string> = {
  MONDAY: "S",
  TUESDAY: "T",
  WEDNESDAY: "Q",
  THURSDAY: "Q",
  FRIDAY: "S",
  SATURDAY: "S",
  SUNDAY: "D",
};

const weekDayNames: Record<GetHomeData200TodayWorkoutDayWeekDay, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

export const orderedWeekDays = weekDays;

export const getWeekDayLabel = (weekDay: GetHomeData200TodayWorkoutDayWeekDay) =>
  weekDayLabels[weekDay];

export const getWeekDayName = (weekDay: GetHomeData200TodayWorkoutDayWeekDay) =>
  weekDayNames[weekDay];

export const getTodayDate = () => dayjs().format("YYYY-MM-DD");

export const getCurrentWeekDates = (referenceDate: string) => {
  const currentDate = dayjs(referenceDate);
  const currentDay = currentDate.day();
  const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
  const mondayDate = currentDate.subtract(daysFromMonday, "day");

  return orderedWeekDays.map((weekDay, index) => ({
    date: mondayDate.add(index, "day").format("YYYY-MM-DD"),
    weekDay,
  }));
};
