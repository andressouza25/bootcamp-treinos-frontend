import Image from "next/image";
import { Flame } from "lucide-react";

import {
  getCurrentWeekDates,
  getTodayDate,
  getWeekDayLabel,
  getWeekDayName,
  getWorkoutStreakValue,
} from "@/app/_lib/home";
import { getAppPageContext } from "@/app/_lib/onboarding";
import FitAiWordmark from "@/components/branding/fit-ai-wordmark";
import BottomNavigation from "@/components/home/bottom-navigation";
import WorkoutDayCard from "@/components/home/workout-day-card";
import { Button } from "@/components/ui/button";

const bannerImageUrl = "/home/home-banner.png";
const todayWorkoutImageUrl = "/home/today-workout.png";

export default async function Home() {
  const { homeData, session } = await getAppPageContext();

  const todayDate = getTodayDate();
  const { activeWorkoutPlanId, consistencyByDay, todayWorkoutDay, workoutStreak } =
    homeData;
  const currentWeekDates = getCurrentWeekDates(todayDate);
  const resolvedWorkoutStreak = getWorkoutStreakValue(
    consistencyByDay,
    todayDate,
    workoutStreak,
  );
  const userName =
    session.user.name ?? session.user.email?.split("@")[0] ?? "Aluno";

  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col bg-background pb-[120px]">
        <section className="relative flex h-[296px] flex-col justify-between overflow-hidden rounded-b-[20px] px-5 pb-10 pt-5">
          <Image
            alt="Atleta segurando halter"
            className="object-cover object-center"
            fill
            priority
            sizes="100vw"
            src={bannerImageUrl}
          />
          <div className="absolute inset-0 bg-home-banner-overlay" />

          <FitAiWordmark className="relative z-10" tone="inverse" />

          <div className="relative z-10 flex items-end justify-between">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-[24px] font-semibold leading-[1.05] text-primary-foreground">
                Olá, {userName}
              </h1>
              <p className="text-[14px] leading-[1.15] text-home-workout-meta">
                Bora treinar hoje?
              </p>
            </div>

            <div className="rounded-full bg-primary px-4 py-2">
              <span className="text-[14px] font-semibold leading-none text-primary-foreground">
                Bora!
              </span>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3 px-5 pt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold leading-[1.4] text-foreground">
              Consistência
            </h2>
            <Button
              className="h-auto p-0 text-[12px] font-normal leading-[1.4] text-primary hover:text-primary"
              type="button"
              variant="link"
            >
              Ver histórico
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex w-full items-center justify-between rounded-[12px] border border-home-surface-border bg-background px-5 py-5">
              {currentWeekDates.map(({ date, weekDay }) => {
                const consistency = consistencyByDay[date] as
                  | typeof consistencyByDay[string]
                  | undefined;
                const isCompleted = consistency?.workoutDayCompleted ?? false;
                const isStarted = consistency?.workoutDayStarted ?? false;
                const isToday = weekDay === todayWorkoutDay.weekDay;

                const className = [
                  "size-5 rounded-[6px] border border-home-surface-border bg-home-week-empty",
                  isStarted ? "border-primary bg-home-week-partial" : "",
                  isCompleted ? "border-primary bg-primary" : "",
                  isToday && !isStarted && !isCompleted
                    ? "border-[1.6px] border-primary"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div key={weekDay} className="flex flex-col items-center gap-1.5">
                    <div className={className} />
                    <span className="text-[12px] leading-[1.4] text-home-week-label">
                      {getWeekDayLabel(weekDay)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center rounded-[12px] bg-home-streak-background px-5 py-8">
              <div className="flex items-center gap-2">
                <Flame className="size-5 fill-home-streak-icon text-home-streak-icon" />
                <span className="text-[16px] font-semibold leading-[1.15] text-foreground">
                  {resolvedWorkoutStreak}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3 px-5 pt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold leading-[1.4] text-foreground">
              Treino de Hoje
            </h2>
            <Button
              className="h-auto p-0 text-[12px] font-normal leading-[1.4] text-primary hover:text-primary"
              type="button"
              variant="link"
            >
              Ver treinos
            </Button>
          </div>

          <WorkoutDayCard
            coverImageSrc={todayWorkoutDay.coverImageUrl ?? todayWorkoutImageUrl}
            estimatedDurationInSeconds={todayWorkoutDay.estimatedDurationInSeconds}
            exercisesCount={todayWorkoutDay.exercisesCount}
            name={todayWorkoutDay.name}
            weekDayLabel={getWeekDayName(todayWorkoutDay.weekDay)}
            workoutDayId={todayWorkoutDay.id}
            workoutPlanId={activeWorkoutPlanId}
          />
        </section>
      </main>

      <BottomNavigation activeItem="home" />
    </>
  );
}
