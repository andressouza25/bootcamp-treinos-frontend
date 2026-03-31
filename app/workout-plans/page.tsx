import { redirect } from "next/navigation";

import { getAppPageContext } from "@/app/_lib/onboarding";

export default async function WorkoutPlansPage() {
  const { homeData } = await getAppPageContext();

  redirect(`/workout-plans/${homeData.activeWorkoutPlanId}`);
}
