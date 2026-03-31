import { Flame } from "lucide-react";

type StatsStreakBannerProps = {
  workoutStreak: number;
  workoutStreakLabel: string;
};

export default function StatsStreakBanner({
  workoutStreak,
  workoutStreakLabel,
}: StatsStreakBannerProps) {
  const isActive = workoutStreak > 0;
  const bannerBackgroundImage = isActive
    ? "var(--stats-banner-active)"
    : "var(--stats-banner-inactive)";

  return (
    <section className="relative flex min-h-[212px] w-full flex-col items-center justify-center overflow-hidden rounded-[12px] px-5 py-10">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundImage: bannerBackgroundImage }}
      />
      <div className="absolute inset-0 bg-stats-banner-overlay" />

      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="flex size-14 items-center justify-center rounded-full border border-stats-banner-chip-border bg-stats-banner-chip backdrop-blur-[4px]">
          <Flame className="size-8 fill-primary-foreground text-primary-foreground" />
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-[48px] font-semibold leading-[0.95] text-primary-foreground">
            {workoutStreakLabel}
          </p>
          <p className="text-[16px] leading-[1.15] text-stats-banner-subtitle">
            Sequencia Atual
          </p>
        </div>
      </div>
    </section>
  );
}
