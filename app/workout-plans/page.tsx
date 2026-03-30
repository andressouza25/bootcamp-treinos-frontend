import { redirect } from "next/navigation";

import {
  getHomeData,
  listWorkoutPlan,
} from "@/app/_lib/api/fetch-generated";
import { getServerSession } from "@/app/_lib/get-server-session";
import { getTodayDate } from "@/app/_lib/home";

export default async function WorkoutPlansPage() {
  const session = await getServerSession();

  if (!session?.session.userId) {
    redirect("/auth");
  }

  const homeDataResponse = await getHomeData(getTodayDate(), {
    cache: "no-store",
  });

  if (homeDataResponse.status === 401) {
    redirect("/auth");
  }

  if (homeDataResponse.status === 200) {
    redirect(`/workout-plans/${homeDataResponse.data.activeWorkoutPlanId}`);
  }

  const workoutPlansResponse = await listWorkoutPlan(
    { active: "true" },
    {
      cache: "no-store",
    },
  );

  if (workoutPlansResponse.status === 401) {
    redirect("/auth");
  }

  if (workoutPlansResponse.status === 200) {
    const [activeWorkoutPlan] = workoutPlansResponse.data.workoutPlans;

    if (activeWorkoutPlan) {
      redirect(`/workout-plans/${activeWorkoutPlan.id}`);
    }
  }

  redirect("/");
}
