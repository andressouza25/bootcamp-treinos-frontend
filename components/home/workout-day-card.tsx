import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Dumbbell, Timer } from "lucide-react";

type WorkoutDayCardProps = {
  coverImageSrc: string;
  estimatedDurationInSeconds: number;
  exercisesCount: number;
  href: string;
  name: string;
  weekDayLabel: string;
};

const getDurationLabel = (estimatedDurationInSeconds: number) => {
  const totalMinutes = Math.max(1, Math.round(estimatedDurationInSeconds / 60));

  return `${totalMinutes}min`;
};

export default function WorkoutDayCard({
  coverImageSrc,
  estimatedDurationInSeconds,
  exercisesCount,
  href,
  name,
  weekDayLabel,
}: WorkoutDayCardProps) {
  return (
    <Link
      className="relative flex h-[200px] w-full flex-col justify-between overflow-hidden rounded-[12px] p-5"
      href={href}
    >
      <Image
        alt={`Treino ${name}`}
        className="object-cover"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 350px"
        src={coverImageSrc}
      />
      <div className="absolute inset-0 bg-home-workout-overlay" />

      <div className="relative z-10">
        <div className="inline-flex items-center justify-center gap-1 rounded-full bg-home-chip px-[10px] py-[5px] backdrop-blur-[4px]">
          <CalendarDays className="size-[14px] text-primary-foreground" />
          <span className="text-[12px] leading-none font-semibold text-primary-foreground">
            {weekDayLabel}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-2">
        <h2 className="text-[24px] leading-[1.05] font-semibold text-primary-foreground">
          {name}
        </h2>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Timer className="size-[14px] text-home-workout-meta" />
            <span className="text-[12px] leading-[1.4] text-home-workout-meta">
              {getDurationLabel(estimatedDurationInSeconds)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Dumbbell className="size-[14px] text-home-workout-meta" />
            <span className="text-[12px] leading-[1.4] text-home-workout-meta">
              {exercisesCount} exercícios
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
