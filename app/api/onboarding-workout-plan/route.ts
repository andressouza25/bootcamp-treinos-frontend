import { NextResponse } from "next/server";

import {
  createWorkoutPlan,
  getHomeData,
} from "@/app/_lib/api/fetch-generated";
import { getTodayDate } from "@/app/_lib/home";
import { extractWorkoutPlanFromMessages } from "@/app/_lib/onboarding-workout-plan";

type ChatMessage = {
  parts?: Array<{
    text?: string;
    type?: string;
  }>;
  role?: string;
};

type OnboardingWorkoutPlanRequestBody = {
  messages?: ChatMessage[];
};

export async function POST(request: Request) {
  const body = (await request.json()) as OnboardingWorkoutPlanRequestBody;
  const messages = body.messages ?? [];

  if (messages.length === 0) {
    return NextResponse.json(
      { message: "Nenhuma mensagem foi enviada." },
      { status: 400 },
    );
  }

  const homeDataResponse = await getHomeData(getTodayDate(), {
    cache: "no-store",
  });

  if (homeDataResponse.status === 200) {
    return NextResponse.json({
      data: {
        workoutPlanId: homeDataResponse.data.activeWorkoutPlanId,
      },
    });
  }

  if (homeDataResponse.status === 401) {
    return NextResponse.json(
      { message: "Sessao invalida." },
      { status: 401 },
    );
  }

  const workoutPlan = extractWorkoutPlanFromMessages(messages);

  if (!workoutPlan) {
    return NextResponse.json(
      { message: "Nao foi possivel identificar um plano de treino na conversa." },
      { status: 422 },
    );
  }

  const createWorkoutPlanResponse = await createWorkoutPlan(workoutPlan);

  if (createWorkoutPlanResponse.status !== 201) {
    const responseData = createWorkoutPlanResponse.data as
      | { code?: string; error?: string }
      | undefined;

    return NextResponse.json(
      {
        code: responseData?.code,
        message: responseData?.error ?? "Nao foi possivel salvar o plano de treino.",
      },
      { status: createWorkoutPlanResponse.status },
    );
  }

  return NextResponse.json({
    data: {
      workoutPlanId: createWorkoutPlanResponse.data.id,
    },
  });
}
