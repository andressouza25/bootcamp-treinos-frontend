import type { StatsHeatmapMonth } from "@/app/_lib/stats";
import { cn } from "@/lib/utils";

type StatsHeatmapProps = {
  months: StatsHeatmapMonth[];
};

export default function StatsHeatmap({ months }: StatsHeatmapProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[18px] font-semibold leading-[1.4] text-foreground">
        Consistencia
      </h2>

      <div className="overflow-x-auto rounded-[12px] border border-home-surface-border bg-background p-5">
        <div className="flex min-w-max items-start gap-3">
          {months.map((month) => (
            <div key={month.key} className="flex flex-col gap-1.5">
              <span className="text-center text-[12px] leading-[1.4] text-home-week-label">
                {month.label}
              </span>

              <div className="grid auto-cols-max grid-flow-col grid-rows-7 gap-1">
                {month.days.map((day) => (
                  <div
                    key={day.date}
                    className={cn(
                      "size-[17px] rounded-[6px]",
                      !day.isStarted &&
                        !day.isCompleted &&
                        "border border-border bg-background",
                      day.isStarted && !day.isCompleted && "bg-home-week-partial",
                      day.isCompleted && "bg-primary",
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
