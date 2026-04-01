import Link from "next/link";
import { notFound } from "next/navigation";

import { getWorkoutPlan } from "@/app/_lib/api/fetch-generated";
import { getAppPageContext } from "@/app/_lib/onboarding";
import { getWorkoutPlanDays } from "@/app/_lib/workout-plan";
import BottomNavigation from "@/components/home/bottom-navigation";
import { Button } from "@/components/ui/button";
import WorkoutPlanBanner from "@/components/workout-plan/workout-plan-banner";
import WorkoutPlanDayCard from "@/components/workout-plan/workout-plan-day-card";

type WorkoutPlanPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WorkoutPlanPage({
  params,
}: WorkoutPlanPageProps) {
  await getAppPageContext();

  const { id } = await params;
  const workoutPlanResponse = await getWorkoutPlan(id, {
    cache: "no-store",
  });

  if (workoutPlanResponse.status === 403 || workoutPlanResponse.status === 404) {
    notFound();
  }

  if (workoutPlanResponse.status !== 200) {
    return (
      <>
        <main className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col bg-background pb-[120px]">
          <WorkoutPlanBanner workoutPlanName="Plano indisponivel" />

          <section className="px-5 py-5">
            <div className="flex flex-col gap-4 rounded-[20px] border border-border bg-card p-5 text-card-foreground">
              <div className="flex flex-col gap-2">
                <h1 className="text-[20px] font-semibold leading-[1.15] text-foreground">
                  Nao foi possivel carregar este plano
                </h1>
                <p className="text-sm leading-[1.5] text-muted-foreground">
                  O backend respondeu com erro ao montar os exercicios deste plano.
                </p>
                <p className="text-sm leading-[1.5] text-muted-foreground">
                  Pelo log, o problema esta em `estimatedDurationInSeconds` com valor `0`
                  em alguns dias, enquanto o schema exige valor minimo `1`.
                </p>
              </div>

              <Button asChild className="w-full">
                <Link href="/">Voltar para a home</Link>
              </Button>
            </div>
          </section>
        </main>

        <BottomNavigation activeItem="calendar" />
      </>
    );
  }

  const workoutPlan = workoutPlanResponse.data;
  const workoutDays = getWorkoutPlanDays(workoutPlan.workoutDays);

  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col bg-background pb-[120px]">
        <WorkoutPlanBanner workoutPlanName={workoutPlan.name} />

        <section className="flex flex-col gap-3 px-5 py-5">
          {workoutDays.map((workoutDay) => (
            <WorkoutPlanDayCard
              key={workoutDay.id}
              workoutDay={workoutDay}
              workoutPlanId={workoutPlan.id}
            />
          ))}
        </section>
      </main>

      <BottomNavigation activeItem="calendar" />
    </>
  );
}
