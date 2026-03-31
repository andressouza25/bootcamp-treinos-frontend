import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import {
  createWorkoutSessions,
  getWorkoutDays,
  updateWorkoutSession,
} from "@/app/_lib/api/fetch-generated";
import { getWeekDayName } from "@/app/_lib/home";
import { getAppPageContext } from "@/app/_lib/onboarding";
import {
  getWorkoutDayPath,
  getWorkoutSessionCompletedAt,
  getWorkoutSessionState,
} from "@/app/_lib/workout-day";
import BottomNavigation from "@/components/home/bottom-navigation";
import { Button } from "@/components/ui/button";
import WorkoutDayExerciseCard from "@/components/workout-day/workout-day-exercise-card";
import WorkoutDayHeader from "@/components/workout-day/workout-day-header";
import WorkoutDayHero, {
  WorkoutDayHeroActionButton,
} from "@/components/workout-day/workout-day-hero";

type WorkoutDayPageProps = {
  params: Promise<{
    daysId: string;
    id: string;
  }>;
};

export default async function WorkoutDayPage({
  params,
}: WorkoutDayPageProps) {
  await getAppPageContext();

  const { daysId: workoutDayId, id: workoutPlanId } = await params;
  const pagePath = getWorkoutDayPath(workoutPlanId, workoutDayId);

  const startWorkoutSessionAction = async () => {
    "use server";

    const response = await createWorkoutSessions(workoutPlanId, workoutDayId);

    if (response.status === 401) {
      redirect("/auth");
    }

    if (response.status === 201 || response.status === 409) {
      revalidatePath(pagePath);
      return;
    }

    notFound();
  };

  const completeWorkoutSessionAction = async () => {
    "use server";

    const workoutDayResponse = await getWorkoutDays(workoutPlanId, workoutDayId, {
      cache: "no-store",
    });

    if (workoutDayResponse.status === 401) {
      redirect("/auth");
    }

    if (workoutDayResponse.status !== 200) {
      notFound();
    }

    const { inProgressSession } = getWorkoutSessionState(
      workoutDayResponse.data.sessions,
    );

    if (!inProgressSession) {
      revalidatePath(pagePath);
      return;
    }

    const response = await updateWorkoutSession(
      workoutPlanId,
      workoutDayId,
      inProgressSession.id,
      { completedAt: getWorkoutSessionCompletedAt() },
    );

    if (response.status === 401) {
      redirect("/auth");
    }

    if (response.status !== 200) {
      notFound();
    }

    revalidatePath(pagePath);
  };

  const workoutDayResponse = await getWorkoutDays(workoutPlanId, workoutDayId, {
    cache: "no-store",
  });

  if (workoutDayResponse.status === 401) {
    redirect("/auth");
  }

  if (workoutDayResponse.status !== 200) {
    notFound();
  }

  const workoutDay = workoutDayResponse.data;
  const exercises = [...workoutDay.exercises].sort(
    (left, right) => left.order - right.order,
  );
  const { hasCompletedSession, hasInProgressSession } = getWorkoutSessionState(
    workoutDay.sessions,
  );

  const headerTitle =
    hasCompletedSession || hasInProgressSession
      ? "Treino de Hoje"
      : getWeekDayName(workoutDay.weekDay);

  const heroAction =
    hasCompletedSession ? (
      <Button
        className="h-10 rounded-full border border-home-surface-border bg-background px-4 text-[14px] font-semibold leading-none text-foreground hover:bg-background hover:text-foreground"
        type="button"
        variant="ghost"
      >
        Concluído!
      </Button>
    ) : hasInProgressSession ? null : (
      <form action={startWorkoutSessionAction}>
        <WorkoutDayHeroActionButton>Iniciar Treino</WorkoutDayHeroActionButton>
      </form>
    );

  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col bg-background px-5 pb-[120px] pt-5">
        <div className="flex flex-col gap-5">
          <WorkoutDayHeader title={headerTitle} />
          <WorkoutDayHero action={heroAction} workoutDay={workoutDay} />

          <section className="flex flex-col gap-4">
            {exercises.map((exercise) => (
              <WorkoutDayExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </section>

          {!hasCompletedSession && hasInProgressSession ? (
            <form action={completeWorkoutSessionAction}>
              <Button
                className="h-12 w-full rounded-full border border-home-surface-border bg-background text-[14px] font-semibold text-foreground hover:bg-background hover:text-foreground"
                type="submit"
                variant="outline"
              >
                Marcar como concluído
              </Button>
            </form>
          ) : null}
        </div>
      </main>

      <BottomNavigation activeItem="calendar" />
    </>
  );
}
