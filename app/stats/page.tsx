import { CircleCheck, CirclePercent, Hourglass } from "lucide-react";
import { notFound } from "next/navigation";

import { getStats } from "@/app/_lib/api/fetch-generated";
import {
  getConclusionRatePercentage,
  getFormattedTotalTime,
  getFormattedWorkoutStreak,
  getStatsHeatmapMonths,
  getStatsRange,
} from "@/app/_lib/stats";
import { getTodayDate } from "@/app/_lib/home";
import { getAppPageContext } from "@/app/_lib/onboarding";
import BottomNavigation from "@/components/home/bottom-navigation";
import StatsHeader from "@/components/stats/stats-header";
import StatsHeatmap from "@/components/stats/stats-heatmap";
import StatsStreakBanner from "@/components/stats/stats-streak-banner";
import StatsSummaryCard from "@/components/stats/stats-summary-card";

export default async function StatsPage() {
  await getAppPageContext();

  const todayDate = getTodayDate();
  const statsRange = getStatsRange(todayDate);
  const statsResponse = await getStats(statsRange, {
    cache: "no-store",
  });

  if (statsResponse.status !== 200) {
    notFound();
  }

  const heatmapMonths = getStatsHeatmapMonths(
    todayDate,
    statsResponse.data.consistencyByDay,
  );

  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col bg-background pb-[120px]">
        <StatsHeader />

        <div className="flex flex-col gap-5 px-5 pb-5">
          <StatsStreakBanner
            workoutStreak={statsResponse.data.workoutStreak}
            workoutStreakLabel={getFormattedWorkoutStreak(statsResponse.data.workoutStreak)}
          />

          <StatsHeatmap months={heatmapMonths} />

          <section className="flex flex-col gap-3">
            <div className="flex gap-3">
              <StatsSummaryCard
                icon={CircleCheck}
                title="Treinos Feitos"
                value={String(statsResponse.data.completedWorkoutsCount)}
              />
              <StatsSummaryCard
                icon={CirclePercent}
                title="Taxa de conclusão"
                value={getConclusionRatePercentage(statsResponse.data.conclusionRate)}
              />
            </div>

            <StatsSummaryCard
              icon={Hourglass}
              title="Tempo Total"
              value={getFormattedTotalTime(statsResponse.data.totalTimeInSeconds)}
            />
          </section>
        </div>
      </main>

      <BottomNavigation activeItem="stats" />
    </>
  );
}
