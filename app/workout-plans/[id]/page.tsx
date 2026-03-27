import { notFound, redirect } from "next/navigation";

import { getWorkoutPlan } from "@/app/_lib/api/fetch-generated";
import { getServerSession } from "@/app/_lib/get-server-session";
import { getWorkoutPlanDays } from "@/app/_lib/workout-plan";
import BottomNavigation from "@/components/home/bottom-navigation";
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
  const session = await getServerSession();

  if (!session?.session.userId) {
    redirect("/auth");
  }

  const { id } = await params;
  const workoutPlanResponse = await getWorkoutPlan(id, {
    cache: "no-store",
  });

  if (workoutPlanResponse.status === 401) {
    redirect("/auth");
  }

  if (workoutPlanResponse.status !== 200) {
    notFound();
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
