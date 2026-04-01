import type { LucideIcon } from "lucide-react";

type ProfileStatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export default function ProfileStatCard({
  icon: Icon,
  label,
  value,
}: ProfileStatCardProps) {
  return (
    <article className="flex flex-col items-center gap-5 rounded-[12px] bg-stats-surface px-5 py-5 text-center">
      <div className="flex size-[34px] items-center justify-center rounded-full bg-stats-icon-surface text-primary">
        <Icon className="size-4" />
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <p className="text-[24px] font-semibold leading-[1.15] text-foreground">{value}</p>
        <p className="text-[12px] leading-[1.4] uppercase text-home-week-label">{label}</p>
      </div>
    </article>
  );
}
