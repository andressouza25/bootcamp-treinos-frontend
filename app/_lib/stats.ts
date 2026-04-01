import dayjs from "dayjs";

import type { GetStats200ConsistencyByDay } from "@/app/_lib/api/fetch-generated";

type StatsHeatmapDay = {
  date: string;
  isCompleted: boolean;
  isStarted: boolean;
};

export type StatsHeatmapMonth = {
  days: StatsHeatmapDay[];
  key: string;
  label: string;
};

const monthLabels = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];
const statsMonthsCount = 3;

export const getStatsRange = (referenceDate: string) => {
  const currentMonth = dayjs(referenceDate).startOf("month");
  const firstMonth = currentMonth.subtract(statsMonthsCount - 1, "month");

  return {
    from: firstMonth.format("YYYY-MM-DD"),
    to: currentMonth.endOf("month").format("YYYY-MM-DD"),
  };
};

export const getStatsHeatmapMonths = (
  referenceDate: string,
  consistencyByDay: GetStats200ConsistencyByDay,
): StatsHeatmapMonth[] => {
  const currentMonth = dayjs(referenceDate).startOf("month");

  return Array.from({ length: statsMonthsCount }, (_, index) => {
    const monthDate = currentMonth.subtract(statsMonthsCount - index - 1, "month");
    const monthDaysCount = monthDate.daysInMonth();
    const days = Array.from({ length: monthDaysCount }, (_, dayIndex) => {
      const currentDate = monthDate.date(dayIndex + 1);
      const formattedDate = currentDate.format("YYYY-MM-DD");
      const consistency = consistencyByDay[formattedDate];

      return {
        date: formattedDate,
        isCompleted: consistency?.workoutDayCompleted ?? false,
        isStarted: consistency?.workoutDayStarted ?? false,
      };
    });

    return {
      days,
      key: monthDate.format("YYYY-MM"),
      label: monthLabels[monthDate.month()],
    };
  });
};

export const getConclusionRatePercentage = (conclusionRate: number) =>
  `${Math.round(conclusionRate * 100)}%`;

export const getFormattedWorkoutStreak = (workoutStreak: number) =>
  `${workoutStreak} ${workoutStreak === 1 ? "dia" : "dias"}`;

export const getFormattedTotalTime = (totalTimeInSeconds: number) => {
  const totalMinutes = Math.floor(totalTimeInSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h${minutes.toString().padStart(2, "0")}m`;
};
